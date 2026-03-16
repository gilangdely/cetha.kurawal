import { NextRequest, NextResponse } from "next/server";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Konfigurasi path Chrome lokal untuk Windows (Adjust jika perlu)
const LOCAL_CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

export async function POST(req: NextRequest) {
  try {
    const { html, fileName } = await req.json();

    if (!html) {
      return NextResponse.json({ message: "HTML content is required" }, { status: 400 });
    }

    const userId = await getSessionUidFromCookie();
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    // Periksa Kuota (Generate CV)
    const quotaCheck = await QuotaService.checkQuota(userId, ip, "Generate CV");
    if (!quotaCheck.hasQuota) {
      return NextResponse.json(
        { message: quotaCheck.message, requireUpgrade: true },
        { status: 403 }
      );
    }

    console.log("[Export API] Memulai proses printing via Puppeteer Core...");

    // Deteksi environment (Vercel/Serverless vs Local)
    const isLocal = process.env.NODE_ENV === 'development' || !process.env.VERCEL_URL;

    // Launch browser
    const browser = await puppeteer.launch({
      args: isLocal ? ["--no-sandbox", "--disable-setuid-sandbox"] : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal ? LOCAL_CHROME_PATH : await chromium.executablePath(),
      headless: isLocal ? true : (chromium.headless as any),
    });

    const page = await browser.newPage();

    // Set content dengan background putih dan margin nol
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF berbasis teks (vektor)
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    await browser.close();

    console.log("[Export API] PDF berhasil di-generate.");

    // Konsumsi Kuota (Generate CV)
    await QuotaService.consumeQuota(userId, "Generate CV", ip);

    // Return sebagai data biner
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName || "CV.pdf"}"`,
      },
    });
  } catch (error: any) {
    console.error("[Export API Error]:", error);
    return NextResponse.json(
      { message: error.message || "Gagal menghasilkan PDF" },
      { status: 500 }
    );
  }
}
