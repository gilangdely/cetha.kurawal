import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { html, fileName } = await req.json();

    if (!html) {
      return NextResponse.json({ message: "HTML content is required" }, { status: 400 });
    }

    console.log("[Export API] Memulai proses printing via Puppeteer...");

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
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

    // Return sebagai data biner
    return new NextResponse(pdfBuffer, {
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
