import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// 🔹 Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({
  model: "gemma-3-27b-it",
});

function parseJsonSafe(text: string): any {
  // Strategi 1: ambil dari blok markdown code fence
  const fenceMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1]);
    } catch (e) {
      // Lanjut ke strategi berikutnya
    }
  }

  // Strategi 2: ambil objek { ... } terluar
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    const candidate = text.substring(start, end + 1);
    try {
      return JSON.parse(candidate);
    } catch (e) {
      throw new Error(`Ditemukan struktur JSON tapi gagal di-parse: ${e}`);
    }
  }

  throw new Error(`Tidak ditemukan JSON valid dalam respons model.\nCuplikan respons: ${text.substring(0, 300)}`);
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userId = await getSessionUidFromCookie();

    const quotaCheck = await QuotaService.checkQuota(userId, ip, "Improve LinkedIn");
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { success: false, message: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    const body = await req.json();
    const data = body.data || body; // Support raw linkedin payload or formatted payload

    const name = data.name || data.fullName || (data.firstName ? `${data.firstName} ${data.lastName}` : "");
    const headline = data.headline;
    const about = data.about || data.summary || "";
    
    let locationStr = data.location || "Tidak tersedia";
    if (data.location && typeof data.location === "object") {
      locationStr = data.location.fullLocation || data.location.city || data.location.countryName || "Tidak tersedia";
    }

    const followerCount = data.followerCount;
    const connectionsCount = data.connectionsCount;
    
    const experienceList = data.experience || data.CurrentPositions || [];
    const educationList = data.education || [];

    if (!name || !headline) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data profil tidak lengkap (minimal nama dan headline diperlukan).",
        },
        { status: 400 }
      );
    }

    const formattedExperience = Array.isArray(experienceList)
      ? experienceList
          .slice(0, 3)
          .map(
            (exp: any, i: number) => ({
              title: exp.title || exp.name || "Tidak diketahui",
              company: exp.companyName || exp.company || exp.name || "-",
              duration: exp.duration || "Durasi tidak diketahui",
              description: exp.description || "Tidak ada deskripsi",
            })
          )
      : [];

    const formattedEducation = Array.isArray(educationList)
      ? educationList
          .slice(0, 2)
          .map((edu: any, i: number) => ({
            degree: edu.degree || "Tidak diketahui",
            university: edu.university || "-",
            duration: edu.duration || "Durasi tidak diketahui",
          }))
      : [];

    // 🔹 Buat prompt yang meminta format JSON eksplisit
    const prompt = `
Kamu adalah asisten karier profesional. 
Analisis profil LinkedIn berikut dan berikan hasil **dalam format JSON**.

Struktur JSON yang harus dikembalikan:
{
  "skor_keseluruhan": number (0-100),
  "penilaian_per_kategori": {
    "kelengkapan_informasi": number,
    "keterbacaan_dan_format": number,
    "dampak_pengalaman_kerja": number
  },
  "highlights": [
    { "point": string, "explanation": string }
  ],
  "improvements": [
    { "point": string, "explanation": string }
  ],
  "kesimpulan": string
}

Gunakan penilaian objektif dan analisis profesional.

DATA PROFIL:
Nama: ${name}
Headline: ${headline}
About: ${about || "Tidak tersedia"}
Lokasi: ${locationStr}
Follower: ${followerCount || 0}
Connections: ${connectionsCount || 0}

PENGALAMAN KERJA:
${JSON.stringify(formattedExperience, null, 2)}

PENDIDIKAN:
${JSON.stringify(formattedEducation, null, 2)}

Jawab hanya dengan JSON valid.
`;

    // 🔹 Panggil model Gemini
    const result = await model.generateContent(prompt);
    const text = result?.response?.text() || "{}";

    let parsed;
    try {
      parsed = parseJsonSafe(text);
    } catch (e: any) {
      console.warn("⚠️ Gagal parse JSON:", e.message);
      parsed = { rawText: text }; // Fallback
    }

    await QuotaService.consumeQuota(userId, "Improve LinkedIn", ip);

    return NextResponse.json({
      success: true,
      message: "Analisis berhasil dilakukan.",
      result: parsed,
    });
  } catch (error: any) {
    console.error("❌ Error in /api/linkedin/review:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
