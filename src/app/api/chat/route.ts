import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);

const CETHA_KNOWLEDGE = `
CETHA adalah platform AI karier digital yang memiliki empat fitur utama:
1. AI Review CV: Menganalisis isi CV dan memberi saran profesional.
2. Rekomendasi Pekerjaan: Menyesuaikan peluang kerja berdasarkan kemampuan pengguna.
3. Chatbot Karier: Asisten AI untuk panduan dan konsultasi karier.
4. Artikel Edukasi: Memberikan wawasan dan tips karier terkini.

CETHA fokus pada pengembangan karier digital berbasis AI.
`;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { success } = rateLimit(ip);
    if (!success) {
      return NextResponse.json({ reply: "Terlalu banyak interaksi saat ini, coba lagi sebentar ya." }, { status: 429 });
    }

    // Periksa Kuota AI
    const userId = await getSessionUidFromCookie();
    const quotaCheck = await QuotaService.checkQuota(userId, ip);
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { reply: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    const { message, username } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
Kamu adalah chatbot resmi dari perusahaan CETHA.
Gunakan gaya bicara profesional namun ramah.
Akhiri setiap kalimat dengan nama pengguna.

Berikut informasi resmi perusahaan:
${CETHA_KNOWLEDGE}

Jika pertanyaan user tidak terkait CETHA, jawab:
"Maaf ${username}, aku hanya bisa menjawab hal-hal yang terkait CETHA."

User: ${message}
`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    await QuotaService.consumeQuota(userId, "Chatbot Konsultasi", ip);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: "Terjadi kesalahan, coba lagi ya." });
  }
}
