import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

// Fungsi untuk mendeteksi bahasa input
function detectLanguage(text: string): "id" | "en" {
  // Daftar kata kunci Bahasa Indonesia umum
  const idKeywords = [
    "yang",
    "dan",
    "di",
    "untuk",
    "adalah",
    "dengan",
    "dalam",
    "dari",
    "ke",
    "pada",
    "atau",
    "telah",
    "akan",
    "dapat",
    "juga",
    "lebih",
    "saat",
    "tanpa",
    "mengalami",
    "bekerja",
    "melakukan",
    "mengelola",
    "memimpin",
    "mengembangkan",
  ];

  const words = text.toLowerCase().split(/\s+/);
  const idCount = words.filter((w) => idKeywords.includes(w)).length;

  // Jika lebih dari 15% kata adalah Bahasa Indonesia, anggap Bahasa Indonesia
  return idCount / words.length > 0.15 ? "id" : "en";
}

// Fungsi untuk membuat prompt berdasarkan tipe dan bahasa
function createPrompt(
  type: string,
  context: string,
  language: "id" | "en",
): string {
  if (language === "en") {
    // English prompts
    if (type === "summary") {
      return `You are a professional HR Expert and ATS Resume Writer. Translate or develop the following summary information into a compelling, impactful, and results-focused professional CV introduction using formal and professional English.
User information: "${context}".
Rules:
- Maximum length: 3-5 sentences.
- Return only the result text, without intro or quotation marks.`;
    } else if (type === "experience") {
      return `You are a professional HR Expert and ATS Resume Writer. Develop the following work experience description into bullet points of achievements using Action Verbs and result-oriented metrics, in formal English.
User information: "${context}".
Rules:
- Create bullet points (use • symbol).
- Create approximately 3-4 concise and ATS-friendly bullet points.
- No text other than bullet points.`;
    } else if (type === "education") {
      return `You are an HR Expert. Develop the following education background description into more formal and professional language for a CV (English). Highlight relevance if applicable.
User information: "${context}".
Rules:
- Keep it to 1-2 short paragraphs.
- No intro text, provide the result directly.`;
    }
  } else {
    // Indonesian prompts (default)
    if (type === "summary") {
      return `Anda adalah seorang HR Expert dan ATS Resume Writer profesional. Terjemahkan atau kembangkan informasi summary berikut menjadi perkenalan profesional CV yang sangat meyakinkan, berdampak, berfokus pada hasil, serta menggunakan bahasa yang profesional dan formal (Bahasa Indonesia).
Informasi user: "${context}".
Aturan:
- Panjang teks maksimal 3-5 kalimat.
- Hanya teks hasil yang dikembalikan, tanpa intro atau tanda kutip.`;
    } else if (type === "experience") {
      return `Anda adalah seorang HR Expert dan ATS Resume Writer profesional. Kembangkan deskripsi pengalaman kerja berikut menjadi bullet points pencapaian yang menggunakan Action Verbs (kata kerja aktif) dan berorientasi pada metrik/hasil, dalam bahasa Indonesia yang formal.
Informasi user: "${context}".
Aturan:
- Buat menjadi bullet points (gunakan simbol •).
- Buat sekitar 3-4 bullet point padat dan ATS friendly.
- Jangan ada teks selain bullet points.`;
    } else if (type === "education") {
      return `Anda adalah seorang HR Expert. Kembangkan deskripsi latar belakang edukasi berikut menjadi bahasa yang lebih formal dan profesional di dalam CV (Bahasa Indonesia). Soroti relevansinya jika memungkinkan.
Informasi user: "${context}".
Aturan:
- Cukup 1 sampai 2 paragraf singkat.
- Jangan ada teks pengantar, berikan langsung hasilnya.`;
    }
  }

  return "";
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = rateLimit(ip);

    if (!success) {
      return NextResponse.json(
        { success: false, message: "Terlalu banyak permintaan generate." },
        { status: 429 },
      );
    }

    // Periksa Kuota AI
    const userId = await getSessionUidFromCookie();
    const quotaCheck = await QuotaService.checkQuota(userId, ip);

    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { success: false, message: quotaCheck.message, requireUpgrade: true },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { type, context } = body || {};

    if (!type || !context) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter 'type' dan 'context' wajib diisi.",
        },
        { status: 400 },
      );
    }

    // Deteksi bahasa dari context
    const language = detectLanguage(context);

    // Buat prompt dinamis berdasarkan tipe dan bahasa
    const prompt = createPrompt(type, context, language);

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Type tidak valid" },
        { status: 400 },
      );
    }

    const result = await model.generateContent(prompt);
    let raw = result?.response?.text() || "";

    // Cleanup AI output just in case it adds extra quotes around the raw string
    raw = raw.replace(/^["']|["']$/g, "").trim();

    if (!raw) {
      throw new Error(
        "AI gagal men-generate konten (respons kosong). Silakan coba lagi dengan konteks yang berbeda.",
      );
    }

    // Kurangi kuota jika sukses
    await QuotaService.consumeQuota(userId, "Generate CV AI", ip);

    return NextResponse.json({
      success: true,
      result: raw,
    });
  } catch (error: any) {
    console.error("❌ Error /api/generate-cv:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat generate CV AI.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
