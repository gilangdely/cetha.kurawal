import gradio as gr
import google.generativeai as genai
import fitz  # PyMuPDF
import json
import os
import re
import urllib.parse

# --- KONFIGURASI API KEY ---
API_CONFIGURED = False
try:
    api_key = os.environ.get('GEMINI_API_KEY')
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemma-3-27b-it')  # Gemma 3 1B
        API_CONFIGURED = True
        print("✅ Konfigurasi API dan model berhasil.")
    else:
        print("🛑 Secret 'GEMINI_API_KEY' tidak ditemukan.")
except Exception as e:
    print(f"🛑 Terjadi error saat inisialisasi: {e}")

# --- KONSTANTA ---
MAX_OUTPUT_TOKENS = 8192

# --- FUNGSI-FUNGSI UTAMA ---

def ekstrak_teks_dari_pdf(path_file_pdf):
    try:
        with fitz.open(path_file_pdf) as dokumen:
            teks_lengkap = "".join(halaman.get_text() for halaman in dokumen)
        return teks_lengkap
    except Exception as e:
        raise gr.Error(f"Gagal membaca file PDF: {e}")

def generate_search_links(keywords):
    if not keywords:
        return {}
    keywords_encoded = urllib.parse.quote_plus(keywords)
    keywords_hyphenated = keywords.lower().replace(" ", "-").replace("(", "").replace(")", "")
    links = {
        "LinkedIn":   f"https://www.linkedin.com/jobs/search/?keywords={keywords_encoded}&location=Indonesia",
        "JobStreet":  f"https://www.jobstreet.co.id/id/job-search/{keywords_hyphenated}-jobs/",
        "Glints":     f"https://glints.com/id/opportunities/jobs/explore?keyword={keywords_encoded}",
        "Indeed":     f"https://id.indeed.com/jobs?q={keywords_encoded}",
        "Google Jobs":f"https://www.google.com/search?q={keywords_encoded}+jobs+in+Indonesia&ibp=htl;jobs"
    }
    return links

def parse_json_safe(text: str) -> dict:
    """
    Parse JSON dari teks bebas model.
    Strategi (urutan prioritas):
      1. Cari blok ```json ... ``` atau ``` ... ```
      2. Cari objek { ... } terluar
      3. Raise error jika semua gagal
    """
    # Strategi 1: ambil dari blok markdown code fence
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence_match:
        candidate = fence_match.group(1)
        try:
            return json.loads(candidate)
        except json.JSONDecodeError:
            pass  # lanjut ke strategi berikutnya

    # Strategi 2: ambil objek { ... } terluar
    start = text.find("{")
    end   = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start:end + 1]
        try:
            return json.loads(candidate)
        except json.JSONDecodeError as e:
            raise ValueError(
                f"Ditemukan struktur JSON tapi gagal di-parse: {e}\n"
                f"Cuplikan teks: {candidate[:300]}"
            )

    raise ValueError(
        f"Tidak ditemukan JSON valid dalam respons model.\n"
        f"Cuplikan respons: {text[:300]}"
    )

def log_token_usage(usage_metadata):
    if usage_metadata is None:
        print("⚠️  Token usage: data tidak tersedia.")
        return
    prompt_tokens    = getattr(usage_metadata, 'prompt_token_count',     'N/A')
    candidate_tokens = getattr(usage_metadata, 'candidates_token_count', 'N/A')
    total_tokens     = getattr(usage_metadata, 'total_token_count',      'N/A')
    print("=" * 40)
    print("📊 TOKEN USAGE")
    print(f"   🔼 Input  (prompt)  : {prompt_tokens}")
    print(f"   🔽 Output (response): {candidate_tokens}  [limit: {MAX_OUTPUT_TOKENS}]")
    print(f"   ➕ Total            : {total_tokens}")
    print("=" * 40)

def analyze_career_path(cv_file):
    if not API_CONFIGURED:
        raise gr.Error("API Key Gemini belum terkonfigurasi. Periksa Logs aplikasi.")
    if cv_file is None:
        raise gr.Error("Mohon upload file CV (PDF) Anda.")

    try:
        print("--- Memulai Proses Analisis Karir ---")

        teks_cv = ekstrak_teks_dari_pdf(cv_file.name)
        if not teks_cv:
            raise gr.Error("PDF kosong atau tidak dapat dibaca.")
        print("✅ Teks berhasil diekstrak.")

        print("2. Mengirim permintaan analisis karir ke model...")
        prompt_analisis_karir = f"""
Anda adalah seorang "Career Analyst AI". Baca teks CV berikut dan buat laporan peluang karir.

Teks CV:
---
{teks_cv}
---

PENTING: Balas HANYA dengan satu blok JSON murni. Jangan tambahkan teks, penjelasan, atau komentar apapun di luar JSON.
Format output WAJIB persis seperti ini:

PENTING: Balas HANYA dengan satu blok JSON murni.
Untuk "jabatan_ideal", pilih SATU jabatan paling relevan saja, maksimal 3 kata.
Contoh yang BENAR: "AI Engineer"
Contoh yang SALAH: "AI Engineer / Machine Learning Engineer / Full Stack Developer"

{{
  "jabatan_ideal": "string",
  "alasan_kecocokan": ["poin 1", "poin 2", "poin 3", "poin 4"],
  "deskripsi_pekerjaan": ["poin 1", "poin 2", "poin 3", "poin 4", "poin 5"],
  "potensi_karir": ["poin 1", "poin 2", "poin 3", "poin 4"],
  "kisaran_gaji": {{
    "junior": "Rp X - Rp Y / bulan",
    "mid_level": "Rp X - Rp Y / bulan",
    "senior": "Rp X - Rp Y / bulan"
  }},
  "kelebihan_tambahan": ["poin 1", "poin 2"]
}}
"""

        # ⚠️ Gemma 3 tidak support response_mime_type JSON — dihapus
        generation_config = genai.types.GenerationConfig(
            max_output_tokens=MAX_OUTPUT_TOKENS,
        )
        response = model.generate_content(prompt_analisis_karir, generation_config=generation_config)

        log_token_usage(getattr(response, 'usage_metadata', None))

        raw_text = response.text
        print(f"📝 Raw response preview: {raw_text[:200]!r}")

        # Parse manual — tidak bergantung pada response_mime_type
        try:
            response_json = parse_json_safe(raw_text)
            print("✅ JSON berhasil di-parse.")
        except ValueError as parse_err:
            print(f"🛑 Gagal parse JSON: {parse_err}")
            raise gr.Error(
                f"Model tidak menghasilkan JSON yang valid.\n"
                f"Detail: {parse_err}"
            )

        print("3. Membuat tautan pencarian...")
        search_links = generate_search_links(response_json.get("jabatan_ideal", ""))
        response_json["tautan_pencarian"] = search_links
        print("✅ Tautan pencarian ditambahkan.")

        print("--- Proses Selesai ---")
        return response_json

    except gr.Error:
        raise
    except Exception as e:
        print(f"🛑 ERROR DALAM FUNGSI ANALISIS: {e}")
        raise gr.Error(f"Terjadi kesalahan: {e}")

# --- INTERFACE GRADIO ---
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🚀 API Analis Peluang Karir Personal")
    gr.Markdown("Antarmuka ini dapat digunakan untuk pengujian. Endpoint API publik tersedia di `/run/predict` untuk integrasi ke website Anda.")

    with gr.Row():
        with gr.Column(scale=1):
            cv_pdf = gr.File(label="Upload CV (PDF) untuk Uji Coba", file_types=[".pdf"])
            analyze_button = gr.Button("🔍 Analisis Karir Saya", variant="primary")

        with gr.Column(scale=2):
            output_analysis = gr.JSON(label="Output JSON dari API")

    analyze_button.click(
        fn=analyze_career_path,
        inputs=[cv_pdf],
        outputs=[output_analysis],
        show_progress='full'
    )

if __name__ == "__main__":
    demo.launch()