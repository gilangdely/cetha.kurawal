import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { success } = rateLimit(ip);

        if (!success) {
            return NextResponse.json({ success: false, message: "Terlalu banyak permintaan generate." }, { status: 429 });
        }

        // Periksa Kuota AI
        const userId = await getSessionUidFromCookie();
        const quotaCheck = await QuotaService.checkQuota(userId, ip);

        if (!quotaCheck.hasQuota) {
            return NextResponse.json(
                { success: false, message: quotaCheck.message, requireUpgrade: true },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { type, context } = body || {};

        if (!type || !context) {
            return NextResponse.json(
                { success: false, message: "Parameter 'type' dan 'context' wajib diisi." },
                { status: 400 },
            );
        }

        let prompt = "";

        if (type === "summary") {
            prompt = `Anda adalah seorang HR Expert dan ATS Resume Writer profesional. Terjemahkan atau kembangkan informasi summary berikut menjadi perkenalan profesional CV yang sangat meyakinkan, berdampak, berfokus pada hasil, serta menggunakan bahasa yang profesional dan formal (Bahasa Indonesia).
Informasi user: "${context}".
Aturan:
- Panjang teks maksimal 3-5 kalimat.
- Hanya teks hasil yang dikembalikan, tanpa intro atau tanda kutip.`;
        } else if (type === "experience") {
            prompt = `Anda adalah seorang HR Expert dan ATS Resume Writer profesional. Kembangkan deskripsi pengalaman kerja berikut menjadi bullet points pencapaian yang menggunakan Action Verbs (kata kerja aktif) dan berorientasi pada metrik/hasil, dalam bahasa Indonesia yang formal.
Informasi user: "${context}".
Aturan:
- Buat menjadi bullet points (gunakan simbol •).
- Buat sekitar 3-4 bullet point padat dan ATS friendly.
- Jangan ada teks selain bullet points.`;
        } else if (type === "education") {
            prompt = `Anda adalah seorang HR Expert. Kembangkan deskripsi latar belakang edukasi berikut menjadi bahasa yang lebih formal dan profesional di dalam CV (Bahasa Indonesia). Soroti relevansinya jika memungkinkan.
Informasi user: "${context}".
Aturan:
- Cukup 1 sampai 2 paragraf singkat.
- Jangan ada teks pengantar, berikan langsung hasilnya.`;
        } else {
            return NextResponse.json({ success: false, message: "Type tidak valid" }, { status: 400 });
        }

        const result = await model.generateContent(prompt);
        let raw = result?.response?.text() || "";

        // Cleanup AI output just in case it adds extra quotes around the raw string
        raw = raw.replace(/^["']|["']$/g, "").trim();

        if (!raw) {
            throw new Error("AI gagal men-generate konten (respons kosong). Silakan coba lagi dengan konteks yang berbeda.");
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
