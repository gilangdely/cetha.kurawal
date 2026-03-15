import { NextRequest, NextResponse } from "next/server";
import { Client, handle_file, upload_files } from "@gradio/client";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// ✅ Validasi file
const validateFile = (file: File | null): string | null => {
  if (!file) return "File tidak ditemukan";
  if (file.type !== "application/pdf") {
    return `Format file tidak didukung: ${file.type}. Harus PDF.`;
  }
  return null;
};

// ✅ URL file di Hugging Face Space kamu
const getFileUrl = (filename: string): string =>
  `https://firmanaziz-jobrecommendation-json.hf.space/gradio_api/file=${filename}`;

// ✅ Endpoint utama
export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // Validasi dasar
    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    // Periksa Kuota AI
    const userId = await getSessionUidFromCookie();
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const quotaCheck = await QuotaService.checkQuota(userId, ipAddress, "Job Match");
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { success: false, message: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    // Hubungkan ke Hugging Face Space kamu
    const app = await Client.connect("firmanaziz/jobrecommendation-json");
    const root = app.config?.root;
    if (!root) {
      throw new Error("Konfigurasi root tidak ditemukan");
    }

    // Upload file ke Space
    const { files } = await upload_files.call(app, root, [file!]);
    const fileUrl = getFileUrl(files![0]);

    // Panggil fungsi utama di Hugging Face (sesuai `fn=analyze_career_path`)
    const result = await app.predict("/analyze_career_path", [handle_file(fileUrl)]);

    // Kurangi kuota jika sukses
    await QuotaService.consumeQuota(userId, "Job Match", ipAddress);

    // Kirim hasilnya ke frontend
    return NextResponse.json({ success: true, message: "Review berhasil", data: { result } });
  } catch (error: any) {
    console.error("❌ API Upload Error:", error);

    if (error.response?.status === 429) {
      return NextResponse.json(
        { success: false, message: "Kuota API Server terlampaui. Silakan coba lagi beberapa saat lagi." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || "Terjadi kesalahan saat memproses file (Internal Server Error)." },
      { status: 500 }
    );
  }
};
