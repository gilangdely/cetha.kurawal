import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Initialize Gemini model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

function createPrompt(type: string, context: string): string {
  const baseInstruction = `You are a professional HR Expert and ATS Resume Writer.
Detect the language of the user's input and respond in the SAME language (Indonesian if the input is in Indonesian, English if in English).`;

  if (type === "summary") {
    return `${baseInstruction}
Transform the following information into a compelling, impactful, and results-focused professional CV summary using formal and professional language.
User information: "${context}"
Rules:
- Maximum 3-5 sentences.
- Return only the result text, no intro, no quotation marks.`;
  }

  if (type === "experience") {
    return `${baseInstruction}
Transform the following work experience into achievement-focused bullet points using strong Action Verbs and result-oriented metrics.
User information: "${context}"
Rules:
- Use bullet points (• symbol).
- Write 3-4 concise, ATS-friendly bullet points.
- Return only the bullet points, no other text.`;
  }

  if (type === "education") {
    return `${baseInstruction}
Rewrite the following education background in formal, professional CV language. Highlight relevance where applicable.
User information: "${context}"
Rules:
- Use bullet points (• symbol).
- Write 3-4 concise, ATS-friendly bullet points.
- Return only the bullet points, no other text.`;
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

    const prompt = createPrompt(type, context);

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "Type tidak valid." },
        { status: 400 },
      );
    }

    const result = await model.generateContent(prompt);
    let raw = result?.response?.text() || "";

    // Bersihkan output markdown dari AI (misal: ```markdown ... ```)
    raw = raw.replace(/^```[a-zA-Z]*\n?/, "").replace(/\n?```$/, "").trim();

    // Cleanup jika AI menambahkan tanda kutip di awal/akhir
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