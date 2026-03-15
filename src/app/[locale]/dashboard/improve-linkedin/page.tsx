"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LinkedInAnalysisResult from "@/components/linkedin-analysis";
import LinkedInProfileDisplay from "@/components/linkedin-profile-card";
import { useUploadStore } from "@/store/uploadStore";
import { useLinkedinResultStore } from "../../../../store/linkedinResultStore";
import { useTranslations } from "next-intl";

interface Position {
  companyName: string;
  companyId?: string;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  title?: string;
  subTitle?: string;
  description?: string;
  duration?: string;
}

interface Experience {
  companyName: string;
  companyId?: string;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  title?: string;
  subTitle?: string;
  description?: string;
  duration?: string;
  totalDuration?: string;
  isMultiPositions?: boolean;
  positions?: Position[];
}

interface Education {
  duration: string;
  university: string;
  universityLink?: string;
  degree?: string;
  description?: string;
  subDescription?: string;
}

interface Overview {
  fullName: string;
  headline: string;
  profilePictureURL: string;
  backgroundImageURL: string;
  location?: { fullLocation?: string };
  followerCount?: number;
  connectionsCount?: number;
  CurrentPositions?: { name: string; logoURL: string; url: string }[];
}

interface Detail {
  about?: string;
  positions?: Position[];
  featuredPosts?: { postLink: string; postText: string }[];
  languages?: {
    languages: { Language: string; Level: string }[];
  };
}

interface Profile {
  overview: Overview;
  details: Detail;
  experience: Experience[];
  education: Education[];
}

export default function ImproveLinkedInDashboard() {
  const t = useTranslations("dashboardImproveLinkedinPage");
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const setGlobalUploading = useUploadStore((s) => s.setUploading);
  const setGlobalProgress = useUploadStore((s) => s.setProgress);
  const setLinkedinResult = useLinkedinResultStore((s) => s.setResult);

  const handleAnalyze = async () => {
    setLoading(true);
    setGlobalUploading(true, "linkedin");
    setGlobalProgress(5);
    setError(null);
    setProfile(null);
    setAiResult(null);

    let cleanUsername = username.trim();
    // Ekstrak username secara robust
    if (cleanUsername.includes("linkedin.com/in/")) {
      try {
        const url = new URL(
          cleanUsername.startsWith("http")
            ? cleanUsername
            : `https://${cleanUsername}`,
        );
        const pathParts = url.pathname.split("/").filter(Boolean);
        const inIndex = pathParts.indexOf("in");
        if (inIndex !== -1 && pathParts.length > inIndex + 1) {
          cleanUsername = pathParts[inIndex + 1];
        }
      } catch (e) {
        cleanUsername =
          cleanUsername.split("?")[0].replace(/\/$/, "").split("/").pop() ||
          cleanUsername;
      }
    } else {
      cleanUsername = cleanUsername.split("?")[0].replace(/\/$/, "");
    }

    if (!cleanUsername) {
      setError(t("errors.invalidProfileUrl"));
      setLoading(false);
      setGlobalProgress(0);
      setGlobalUploading(false);
      return;
    }

    try {
      // 1️⃣ Ambil data LinkedIn lengkap
      const res = await fetch(
        `/api/apify-linkedin?username=${encodeURIComponent(cleanUsername)}`,
      );
      const data = await res.json();

      if (!res.ok || data.success === false) {
        if (data.requireUpgrade) {
          throw new Error(
            data.message || data.error || t("errors.dailyLimitReached"),
          );
        }
        throw new Error(
          data.message || data.error || t("errors.fetchProfileFailed"),
        );
      }

      const { overview, details, experience, education } = data.data || data;
      setProfile({ overview, details, experience, education });

      // 2️⃣ Pilih data penting untuk dikirim ke AI
      const selectedData = {
        name: overview?.fullName || "",
        headline: overview?.headline || "",
        about: details?.about || "",
        location: overview?.location?.fullLocation || "",
        followerCount: overview?.followerCount || 0,
        connectionsCount: overview?.connectionsCount || 0,
        education: education?.map((edu: Education) => ({
          university: edu.university,
          degree: edu.degree,
          duration: edu.duration,
          description: edu.description || "",
        })),
        experience: experience?.map((exp: Experience) => ({
          companyName: exp.companyName,
          title: exp.title,
          duration: exp.duration,
          description: exp.description || "",
        })),
      };

      // 3️⃣ Kirim ke API review (AI)
      const aiRes = await fetch("/api/linkedin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedData),
      });

      const aiData = await aiRes.json();
      if (!aiRes.ok)
        throw new Error(aiData.message || t("errors.aiAnalyzeFailed"));
      setGlobalProgress(85);

      // 4️⃣ Simpan hasil AI ke state
      setAiResult(aiData.result);

      const normalizedAiResult =
        typeof aiData.result === "string"
          ? JSON.parse(aiData.result)
          : aiData.result;

      setLinkedinResult({
        profile: { overview, details, experience, education },
        analysis: normalizedAiResult,
      });

      setGlobalProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 350));
      setGlobalUploading(false);
      router.push("/dashboard/improve-linkedin/result-improve-linkedin");
    } catch (err: any) {
      console.error(err);
      setError(err.message || t("errors.requestProcessFailed"));
      setGlobalProgress(0);
      setGlobalUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div>
        {/* Header */}
        <div className="mt-6 mb-8">
          <h2 className="text-TextPrimary text-3xl font-semibold">
            {t("header.title")}
          </h2>
          <p className="text-TextSecondary mt-2 max-w-2xl text-base">
            {t("header.description")}
          </p>
        </div>

        {/* Input */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-TextPrimary mb-4 text-xl font-medium">
            {t("form.title")}
          </h3>
          <div className="flex w-full gap-2">
            <input
              type="text"
              placeholder={t("form.placeholder")}
              className="focus:ring-primaryBlue flex-1 rounded-full border px-3 py-2 focus:ring-2 focus:outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`flex items-center justify-center rounded-full p-2 text-white transition-colors ${
                loading
                  ? "bg-primaryBlue/70 cursor-not-allowed"
                  : "bg-primaryBlue hover:bg-primaryBlue/90"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-12">
        {/* Profile Display */}
        {profile && <LinkedInProfileDisplay profile={profile} />}

        {/* Result */}
        {aiResult && (
          <LinkedInAnalysisResult
            result={
              typeof aiResult === "string" ? JSON.parse(aiResult) : aiResult
            }
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
