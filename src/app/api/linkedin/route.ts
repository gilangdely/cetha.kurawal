import { NextResponse } from "next/server";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || username.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Parameter 'username' wajib diisi." },
      { status: 400 }
    );
  }

  // Periksa Kuota AI
  const userId = await getSessionUidFromCookie();
  const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";

  const quotaCheck = await QuotaService.checkQuota(userId, ipAddress);
  if (!quotaCheck.hasQuota) {
    return NextResponse.json(
      { success: false, message: quotaCheck.message, requireUpgrade: true },
      { status: 403 }
    );
  }

  const apiKeys = process.env.LINKDAPI_KEYS?.split(",").map((k) => k.trim());
  if (!apiKeys || apiKeys.length === 0) {
    return NextResponse.json(
      { success: false, message: "API key tidak ditemukan di environment." },
      { status: 500 }
    );
  }

  const randomKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

  try {
    // 1️⃣ Ambil data overview (untuk dapatkan URN)
    const overviewRes = await fetch(
      `https://linkdapi.com/api/v1/profile/overview?username=${username}`,
      {
        headers: { "X-linkdapi-apikey": randomKey },
        cache: "no-store",
      }
    );

    if (!overviewRes.ok) {
      const errorText = await overviewRes.text();
      console.error(`[LinkdAPI Error] Overview 403/Failure for ${username}:`, errorText);
      return NextResponse.json(
        { success: false, message: `Gagal mengambil data overview (${overviewRes.status}).` },
        { status: overviewRes.status }
      );
    }

    const overviewData = await overviewRes.json();
    const urn = overviewData?.data?.urn;

    if (!urn) {
      return NextResponse.json(
        { success: false, message: `URN tidak ditemukan untuk username '${username}'.` },
        { status: 404 }
      );
    }

    // 2️⃣ Ambil data detail profil
    const detailRes = await fetch(
      `https://linkdapi.com/api/v1/profile/details?urn=${urn}`,
      {
        headers: { "X-linkdapi-apikey": randomKey },
        cache: "no-store",
      }
    );

    if (!detailRes.ok) {
      const errorText = await detailRes.text();
      console.error(`[LinkdAPI Error] Detail 403/Failure for ${urn}:`, errorText);
      return NextResponse.json(
        { success: false, message: `Gagal mengambil data detail (${detailRes.status}).` },
        { status: detailRes.status }
      );
    }

    const detailData = await detailRes.json();

    // 3️⃣ Ambil data experience
    const experienceRes = await fetch(
      `https://linkdapi.com/api/v1/profile/full-experience?urn=${urn}`,
      {
        headers: { "X-linkdapi-apikey": randomKey },
        cache: "no-store",
      }
    );

    if (!experienceRes.ok) {
      const errorText = await experienceRes.text();
      console.error(`[LinkdAPI Error] Experience 403/Failure for ${urn}:`, errorText);
      return NextResponse.json(
        { success: false, message: `Gagal mengambil data pengalaman (${experienceRes.status}).` },
        { status: experienceRes.status }
      );
    }

    const experienceData = await experienceRes.json();

    // 4️⃣ Ambil data education
    const educationRes = await fetch(
      `https://linkdapi.com/api/v1/profile/education?urn=${urn}`,
      {
        headers: { "X-linkdapi-apikey": randomKey },
        cache: "no-store",
      }
    );

    if (!educationRes.ok) {
      const errorText = await educationRes.text();
      console.error(`[LinkdAPI Error] Education 403/Failure for ${urn}:`, errorText);
      return NextResponse.json(
        { success: false, message: `Gagal mengambil data pendidikan (${educationRes.status}).` },
        { status: educationRes.status }
      );
    }

    const educationData = await educationRes.json();

    // Kurangi kuota jika sukses
    await QuotaService.consumeQuota(userId, "LinkedIn Optimization", ipAddress);

    // 5️⃣ Gabungkan semua data jadi satu respons JSON
    return NextResponse.json({
      success: true,
      message: "Data profil lengkap berhasil diambil.",
      data: {
        overview: overviewData.data,
        details: detailData.data,
        experience: experienceData.data?.experience || [],
        education: educationData.data?.education || [],
      }
    });
  } catch (error: any) {
    console.error(`[LinkdAPI Error] Exception caught:`, error);
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan internal server: ${error.message}` },
      { status: 500 }
    );
  }
}
