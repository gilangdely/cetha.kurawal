import { NextRequest, NextResponse } from "next/server";
import { Client, handle_file, upload_files } from "@gradio/client";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

const validateFile = (file: File | null): string | null => {
    if (!file) return "File tidak ditemukan";
    
    const isPdfMime = file.type === "application/pdf";
    const isPdfExt = file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfMime && !isPdfExt) {
        return `Format file tidak didukung: ${file.type}. Harus PDF.`;
    }
    return null;
};

const getFileUrl = (filename: string): string => `https://firmanaziz-cv2.hf.space/gradio_api/file=${filename}`;

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        console.log(`[Server] Received file: ${file?.name}, Size: ${file?.size} bytes, Type: ${file?.type}`);

        const validationError = validateFile(file);
        if (validationError) {
            return NextResponse.json({ success: false, message: validationError }, { status: 400 });
        }

        if (file!.size === 0) {
            return NextResponse.json({ success: false, message: "File PDF kosong atau tidak dapat dibaca" }, { status: 400 });
        }

        // Periksa Kuota AI
        const userId = await getSessionUidFromCookie();
        const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";

        const quotaCheck = await QuotaService.checkQuota(userId, ipAddress);
        if (!quotaCheck.hasQuota) {
            return NextResponse.json(
                { success: false, message: quotaCheck.message, requireUpgrade: true },
                { status: 403 }
            );
        }

        const app = await Client.connect("firmanaziz/CV2");
        const root = app.config?.root;
        if (!root) {
            throw new Error("Konfigurasi root tidak ditemukan");
        }

        // Konversi ke Buffer
        const arrayBuffer = await file!.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log(`[Server] File converted to Buffer, length: ${buffer.length}`);

        // Rekonstruksi objek File yang kompatibel dengan Gradio Nodejs Client
        // Sangat penting untuk menyertakan ekstensi .pdf di nama file agar Gradio tidak menolak tipe file
        const fileName = file!.name.toLowerCase().endsWith('.pdf') ? file!.name : `${file!.name}.pdf`;
        
        // Menggunakan native File constructor (Node.js 22+) untuk menjamin metadata terkirim
        const fileToUpload = new File([buffer], fileName, { type: "application/pdf" });
        
        console.log(`[Server] Prepared file for Gradio: ${fileToUpload.name}, Size: ${fileToUpload.size}, Type: ${fileToUpload.type}`);

        const { files } = await upload_files.call(app, root, [fileToUpload as any]);
        const fileUrl = getFileUrl(files![0]);

        const result = await app.predict("/score_cv", [handle_file(fileUrl)]);

        // Kurangi kuota jika sukses
        await QuotaService.consumeQuota(userId, "CV Review", ipAddress);

        return NextResponse.json({ success: true, message: "Review berhasil", data: { result } });
    } catch (error: any) {
        console.error("❌ API Upload Error Detail:", error);

        const status = error.response?.status || 500;
        const message = error.response?.data?.message || error.message || "Terjadi kesalahan saat memproses file (Internal Server Error).";

        if (status === 429) {
            return NextResponse.json({ success: false, message: "Kuota API Server terlampaui. Silakan coba lagi beberapa saat lagi." }, { status: 429 });
        }

        return NextResponse.json({ success: false, message }, { status });
    }
};
