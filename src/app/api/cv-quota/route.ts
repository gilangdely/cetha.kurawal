import { NextRequest, NextResponse } from "next/server";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

export async function POST(req: NextRequest) {
  try {
    const userId = await getSessionUidFromCookie();
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Periksa Kuota (Generate CV - Cost 2 Tokens)
    const quotaCheck = await QuotaService.checkQuota(userId, ip, "Generate CV");
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { message: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    // Konsumsi Kuota (Generate CV)
    await QuotaService.consumeQuota(userId, "Generate CV", ip);

    console.log(`[Quota API] 2 Cetha Tokens consumed for user: ${userId}`);

    return NextResponse.json({ success: true, message: "Quota consumed successfully" });
  } catch (error: any) {
    console.error("[Quota API Error]:", error);
    return NextResponse.json(
      { message: error.message || "Gagal memproses kuota" },
      { status: 500 }
    );
  }
}
