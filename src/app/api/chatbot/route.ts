import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API!);

// Knowledge base internal CETHA
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
      return NextResponse.json({ reply: "Terlalu banyak permintaan chatbot." }, { status: 429 });
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
    const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

    const prompt = `
Kamu adalah asisten virtual CETHA, platform AI yang membantu pengguna mengembangkan karier digital.
Gaya bicaramu harus terasa alami, seperti ngobrol dengan teman yang paham dunia kerja — santai, ramah, tapi tetap sopan dan profesional.
Hindari gaya robotik atau terlalu baku, dan jangan gunakan tanda seperti bintang (*) atau format markdown apapun.

ATURAN PENTING:
- Jawab SINGKAT dan PADAT, maksimal 3-4 kalimat saja.
- Langsung ke inti jawaban, jangan bertele-tele.
- Gunakan kalimat yang mengalir, tidak terlalu panjang.
- Hindari mengulang kata secara berlebihan.
- Kalau menyebut nama pengguna (${username}), sebut hanya sekali di bagian yang terasa alami.

Berikut info resmi tentang CETHA yang bisa kamu jadikan dasar:
${CETHA_KNOWLEDGE}

Kalau pengguna tanya sesuatu di luar topik CETHA, jawab dengan halus dan tetap sopan, contohnya:
"Maaf ya, aku cuma bisa bantu jelasin hal-hal seputar CETHA aja."

Tugasmu adalah menjawab pertanyaan pengguna dengan penjelasan yang enak dibaca, singkat, dan terasa seperti percakapan manusia.

User: ${message}
`;

    const result = await model.generateContent(prompt);
    
    // Log penggunaan token GEMINI
    const usage = result.response.usageMetadata;
    if (usage) {
        console.log(`[GEMINI API] Token Usage - Input: ${usage.promptTokenCount}, Output: ${usage.candidatesTokenCount}, Total: ${usage.totalTokenCount}`);
    }

    const reply = result.response.text();

    await QuotaService.consumeQuota(userId, "Chatbot Konsultasi", ip);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ reply: "Terjadi kesalahan, coba lagi ya." });
  }
}
