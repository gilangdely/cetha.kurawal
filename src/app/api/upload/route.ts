import { NextRequest, NextResponse } from "next/server";
import { Client, handle_file, upload_files } from "@gradio/client";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

const validateFile = (file: File | null): string | null => {
  if (!file) return "File tidak ditemukan";
  
  const isPdfMime = file.type === "application/pdf";
  const isPdfExt = file.name.toLowerCase().endsWith(".pdf");

  if (!isPdfMime && !isPdfExt) {
    return `Format file tidak didukung. Harus PDF.`;
  }
  return null;
};

const getFileUrl = (filename: string): string =>
  `https://firmanaziz-cv2.hf.space/gradio_api/file=${filename}`;

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    // 1. Validasi Awal
    const validationError = validateFile(file);
    if (validationError) {
      return NextResponse.json({ success: false, message: validationError }, { status: 400 });
    }

    if (file!.size === 0) {
      return NextResponse.json({ success: false, message: "File PDF kosong" }, { status: 400 });
    }

    // 2. Periksa Kuota
    const userId = await getSessionUidFromCookie();
    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const quotaCheck = await QuotaService.checkQuota(userId, ipAddress, "CV Review");
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { success: false, message: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    // 3. Koneksi ke Gradio
    const app = await Client.connect("firmanaziz/CV2");
    const root = app.config?.root;
    if (!root) throw new Error("Konfigurasi API AI tidak ditemukan");

    // 4. Persiapan File (Buffer & Re-construct)
    const arrayBuffer = await file!.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file!.name.toLowerCase().endsWith('.pdf') ? file!.name : `${file!.name}.pdf`;
    const fileToUpload = new File([buffer], fileName, { type: "application/pdf" });

    // 5. Upload & Predict
    const { files } = await upload_files.call(app, root, [fileToUpload as any]);
    if (!files || files.length === 0) throw new Error("Gagal mengunggah file ke server AI");
    
    const fileUrl = getFileUrl(files[0]);
    const result = await app.predict("/score_cv", [handle_file(fileUrl)]);

    // 6. Konsumsi Kuota (Hanya jika sukses)
    await QuotaService.consumeQuota(userId, "CV Review", ipAddress);

    return NextResponse.json({ 
      success: true, 
      message: "Review berhasil", 
      data: { result: (result as any).data } 
    });

  } catch (error: any) {
    console.error("❌ API Upload Error:", error);

    const message = error.message || "";
    
    // Custom error handling untuk PDF tidak terbaca
    if (message.toLowerCase().includes("pdf kosong") || message.toLowerCase().includes("tidak dapat dibaca")) {
      return NextResponse.json({
        success: false,
        message: "PDF berhasil diunggah, tetapi teks tidak terbaca. Pastikan bukan hasil scan/gambar."
      }, { status: 400 });
    }

    // Error handling untuk rate limit
    if (error.response?.status === 429 || message.includes("429")) {
      return NextResponse.json({
        success: false,
        message: "Server AI sedang sibuk. Silakan coba lagi nanti."
      }, { status: 429 });
    }

    return NextResponse.json({
      success: false,
      message: "Terjadi kesalahan internal saat memproses CV."
    }, { status: 500 });
  }
};