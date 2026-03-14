import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";
import { QuotaService } from "@/lib/quota-service";
import { getSessionUidFromCookie } from "@/app/lib/session";

// Normalize raw Apify item → format compatible with /api/linkedin
function normalizeApifyProfile(raw: any) {
  // ── overview ──────────────────────────────────────────────────────────────
  const overview = {
    fullName: raw.full_name ?? "",
    headline: raw.profile_headline ?? "",
    profilePictureURL: raw.avatar_url ?? "",
    backgroundImageURL: raw.background_picture ?? "",
    location: { fullLocation: raw.location ?? "" },
    followerCount: raw.followers ?? 0,
    connectionsCount: raw.connections ?? 0,
    CurrentPositions: raw.current_company_name
      ? [
          {
            name: raw.current_company_name,
            logoURL: raw.company_image ?? "",
            url: raw.current_company_linkedin_url ?? "",
          },
        ]
      : [],
  };

  // ── details ───────────────────────────────────────────────────────────────
  const details = {
    about: raw.description ?? "",
    featuredPosts: (raw.featured ?? []).map((f: any) => ({
      postLink: f.url ?? "",
      postText: f.text ?? "",
    })),
    languages: raw.language?.length
      ? {
          languages: raw.language.map((l: any) => ({
            Language: l.name ?? l,
            Level: l.proficiency ?? "",
          })),
        }
      : undefined,
  };

  // ── experience ────────────────────────────────────────────────────────────
  const experience = (raw.experience ?? []).map((exp: any) => {
    const startDate = formatApifyDate(exp.job_started_on);
    const endDate = exp.job_still_working
      ? "Sekarang"
      : formatApifyDate(exp.job_ended_on);

    return {
      companyName: exp.company_name ?? "",
      companyId: exp.company_id ?? "",
      companyLogo: exp.company_image ?? "",
      title: exp.job_title ?? "",
      subTitle: exp.employment_type ?? "",
      duration: startDate && endDate ? `${startDate} – ${endDate}` : "",
      location: exp.job_location ?? "",
      description: (exp.job_description ?? []).join("\n"),
    };
  });

  // ── education ─────────────────────────────────────────────────────────────
  const education = (raw.education ?? []).map((edu: any) => {
    const startYear = edu.started_on?.year ?? "";
    const endYear = edu.ended_on?.year ?? "";
    return {
      university: edu.university_name ?? "",
      universityLink: edu.social_url ?? "",
      degree: (edu.fields_of_study ?? []).join(", "),
      duration:
        startYear && endYear
          ? `${startYear} – ${endYear}`
          : String(startYear || endYear),
      description: edu.grade ? `IPK: ${edu.grade}` : "",
    };
  });

  return { overview, details, experience, education };
}

function formatApifyDate(dateStr?: string): string {
  if (!dateStr) return "";
  const [month, year] = dateStr.split("-");
  if (!month || !year) return dateStr;
  return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
    "id-ID",
    {
      month: "short",
      year: "numeric",
    },
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username || username.trim() === "") {
    return NextResponse.json(
      { success: false, message: "Parameter 'username' wajib diisi." },
      { status: 400 },
    );
  }

  // ── Quota check ────────────────────────────────────────────────────────────
  const userId = await getSessionUidFromCookie();
  const ipAddress = request.headers.get("x-forwarded-for") || "127.0.0.1";

  const quotaCheck = await QuotaService.checkQuota(userId, ipAddress);
  if (!quotaCheck.hasQuota) {
    return NextResponse.json(
      { success: false, message: quotaCheck.message, requireUpgrade: true },
      { status: 403 },
    );
  }

  // ── Apify token ────────────────────────────────────────────────────────────
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: "APIFY_TOKEN tidak ditemukan di environment.",
      },
      { status: 500 },
    );
  }

  try {
    const client = new ApifyClient({ token });

    const profileUrl = `https://www.linkedin.com/in/${username.replace(/\/$/, "")}/`;
    const run = await client
      .actor("e1xYKjtHLG2Js5YdC")
      .call({ url: profileUrl });
    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: `Profil '${username}' tidak ditemukan.` },
        { status: 404 },
      );
    }

    const normalized = normalizeApifyProfile(items[0]);

    // Consume quota on success
    await QuotaService.consumeQuota(userId, "LinkedIn Optimization", ipAddress);

    return NextResponse.json({
      success: true,
      message: "Data profil lengkap berhasil diambil.",
      data: normalized,
    });
  } catch (error: any) {
    console.error("Apify LinkedIn Error:", error);
    return NextResponse.json(
      { success: false, message: `Terjadi kesalahan server: ${error.message}` },
      { status: 500 },
    );
  }
}
