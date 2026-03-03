import { NextRequest, NextResponse } from "next/server";
import { Client, handle_file, upload_files } from "@gradio/client";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

const validateFile = (file: File | null): string | null => {
    if (!file) return "File tidak ditemukan";
    if (file.type !== "application/pdf") {
        return `Format file tidak didukung: ${file.type}. Harus PDF.`;
    }
    return null;
};

const getFileUrl = (filename: string): string => `https://firmanaziz-cv3.hf.space/gradio_api/file=${filename}`;

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        const validationError = validateFile(file);
        if (validationError) {
            return NextResponse.json({ success: false, message: validationError }, { status: 400 });
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

        const app = await Client.connect("firmanaziz/CV3");
        const root = app.config?.root;
        if (!root) {
            throw new Error("Konfigurasi root tidak ditemukan");
        }

        const { files } = await upload_files.call(app, root, [file!]);
        const fileUrl = getFileUrl(files![0]);

        const result = await app.predict("/score_cv_json", [handle_file(fileUrl)]);

        // Kurangi kuota jika sukses
        await QuotaService.consumeQuota(userId, "CV Review", ipAddress);

        return NextResponse.json({ success: true, message: "Review berhasil", data: { result } });
    } catch (error: any) {
        console.error("❌ API Upload Error:", error);

        if (error.response?.status === 429) {
            return NextResponse.json({ success: false, message: "Kuota API Server terlampaui. Silakan coba lagi beberapa saat lagi." }, { status: 429 });
        }

        return NextResponse.json({ success: false, message: error?.message || "Terjadi kesalahan saat memproses file (Internal Server Error)." }, { status: 500 });
    }
};
