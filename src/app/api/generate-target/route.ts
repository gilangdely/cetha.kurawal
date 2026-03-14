
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rateLimit } from "@/app/lib/rate-limit";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Initialize Gemini model (same key usage as other AI endpoints)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({ model: "gemma-3-27b-it" });

/**
 * POST /api/generate-target
 * Body: { title: string; count?: number }
 * Returns AI-generated task checklist JSON for the given career target title.
 */
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
    const { title, count = 6 } = body || {};

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, message: "Parameter 'title' wajib diisi." },
        { status: 400 },
      );
    }

    const safeCount = Math.min(Math.max(Number(count) || 6, 3), 12); // clamp 3..12

    const prompt = `Anda adalah asisten pengembangan karir profesional.
Buat daftar langkah/tugas terstruktur untuk mencapai target karir berikut.
Target Karir: "${title}".
Jumlah tugas yang diinginkan: ${safeCount}.

FORMAT JSON WAJIB (tanpa teks tambahan, tanpa markdown fences) hanya seperti ini:
{
  "tasks": [
    { "id": number, "label": string, "checked": false }
  ],
  "summary": string
}

Aturan:
- Urutkan tugas dari pondasi ke level lanjut.
- Gunakan bahasa Indonesia lugas, maksimal 120 karakter per label.
- ID berurutan mulai dari 1.
- Tidak ada field lain.
- Tidak ada teks di luar JSON.
Jawab hanya JSON valid.`;

    const result = await model.generateContent(prompt);
    const raw = result?.response?.text() || "{}";

    // Robust JSON parsing for gemma-3-27b-it
    let parsed;
    try {
      let cleaned = raw
        .replace(/```(?:json)?\s*/gi, "") // strip markdown fences
        .replace(/```/g, "")
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
        .trim();

      // Remove trailing commas before } or ]
      cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

      // Try direct parse first
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        // Fallback: try to extract JSON object via regex
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extracted = jsonMatch[0].replace(/,\s*([}\]])/g, "$1");
          parsed = JSON.parse(extracted);
        } else {
          throw new Error("No valid JSON object found in AI response");
        }
      }
    } catch (e) {
      console.warn("⚠️ JSON parse failed for generate-target, raw:", raw);
      parsed = { tasks: [], summary: "Gagal parse JSON AI" };
    }

    // Normalisasi ke struktur edit-target-karir
    const normalizedTasks = Array.isArray(parsed.tasks)
      ? parsed.tasks.map((t: any, idx: number) => ({
        id: typeof t.id === "number" ? t.id : idx + 1,
        label: t.label || `Tugas ${idx + 1}`,
        checked: false,
      }))
      : [];

    const summary = typeof parsed.summary === "string" ? parsed.summary : "";

    await QuotaService.consumeQuota(userId, "Generate Career Target", ip);

    return NextResponse.json({
      success: true,
      title,
      count: normalizedTasks.length,
      result: { tasks: normalizedTasks, summary },
    });
  } catch (error: any) {
    console.error("❌ Error /api/generate-target:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat generate task.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export function GET() {
  // Simple health/info endpoint
  return NextResponse.json({
    endpoint: "generate-target",
    model: "gemma-3-27b-it",
    status: "ok",
  });
}
