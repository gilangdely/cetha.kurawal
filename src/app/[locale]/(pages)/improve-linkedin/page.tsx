"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import illustration from "@/assets/img/illustration-improve-linkedIn.jpg";
import { UpgradeModal } from "@/components/UpgradeModal";
import { useLinkedinResultStore } from "@/store/linkedinResultStore";
import { useUploadStore } from "@/store/uploadStore";

import { auth } from "@/app/lib/firebase";

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

export default function ImproveLinkedInPage() {
  const t = useTranslations("improveLinkedinPage");
  const router = useRouter();
  const setLinkedinResult = useLinkedinResultStore((s) => s.setResult);
  const setGlobalUploading = useUploadStore((s) => s.setUploading);
  const setGlobalProgress = useUploadStore((s) => s.setProgress);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ipAddress, setIpAddress] = useState<string>("");
  const [attemptsLeft, setAttemptsLeft] = useState<number>(3);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // Dapatkan IP address dan periksa jumlah percobaan yang tersisa
  useEffect(() => {
    const fetchIpAndCheckLimit = async () => {
      try {
        // Ambil IP address dari API
        const res = await fetch("/api/ip");
        const data = await res.json();
        const ip = data.ip;
        setIpAddress(ip);

        // Periksa jumlah percobaan dari localStorage
        const key = `linkedin-analysis-count-${ip}`;
        const attemptCount = parseInt(localStorage.getItem(key) || "0");
        const remaining = Math.max(0, 3 - attemptCount);
        setAttemptsLeft(remaining);

        // Periksa status login (ganti dengan logika autentikasi yang sebenarnya)
        // Untuk contoh ini diasumsikan user tidak login
        setIsLoggedIn(false);
      } catch (err) {
        console.error("Error fetching IP:", err);
      }
    };

    fetchIpAndCheckLimit();
  }, []);

  useEffect(() => {
    const checkAttempts = async () => {
      try {
        // Ambil IP
        const ipRes = await fetch("/api/ip");
        const ipData = await ipRes.json();
        const ip = ipData.ip;
        setIpAddress(ip);

        // Cek status login (ganti dengan logika auth sebenarnya nanti)
        const user = auth.currentUser; // ← Jika pakai Firebase
        setIsLoggedIn(!!user);

        if (user) {
          // User login → tidak ada batas
          setAttemptsLeft(Infinity);
          return;
        }

        // Untuk user belum login: cek berdasarkan IP
        const key = `linkedin-attempts-${ip}`;
        const count = parseInt(localStorage.getItem(key) || "0");
        const remaining = Math.max(0, 5 - count); // ← ubah jadi 5
        setAttemptsLeft(remaining);
      } catch (err) {
        console.error("Error checking attempts:", err);
        // Jika gagal, anggap user punya 0 percobaan (aman)
        setAttemptsLeft(0);
      }
    };

    checkAttempts();
  }, []);

  const handleAnalyze = async () => {
    if (!isLoggedIn && attemptsLeft <= 0) {
      setError(t("errors.limitReached"));
      return;
    }

    setLoading(true);
    setGlobalUploading(true, "linkedin");
    setGlobalProgress(5);
    setError(null);

    let cleanUsername = username.trim();
    // Ekstrak username secara robust (hindari querystring atau subdomain bahasa)
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
        // Fallback jika new URL gagal
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
      if (!isLoggedIn) {
        const newCount =
          parseInt(
            localStorage.getItem(`linkedin-attempts-${ipAddress}`) || "0",
          ) + 1;
        localStorage.setItem(
          `linkedin-attempts-${ipAddress}`,
          String(newCount),
        );
        setAttemptsLeft(Math.max(0, 5 - newCount));
      }

      // 1️⃣ Ambil data LinkedIn lengkap
      const res = await fetch(
        `/api/apify-linkedin?username=${encodeURIComponent(cleanUsername)}`,
      );
      const data = await res.json();

      if (!res.ok || data.success === false) {
        if (data.requireUpgrade) {
          setUpgradeMessage(
            data.message || data.error || t("errors.quotaExhausted"),
          );
          setShowUpgradeModal(true);
          setGlobalProgress(0);
          setGlobalUploading(false);
          return; // hentikan eksekusi
        }
        throw new Error(
          data.message || data.error || t("errors.fetchProfileFailed"),
        );
      }
      setGlobalProgress(40);

      const { overview, details, experience, education } = data.data || data;

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
      if (!aiRes.ok || aiData.success === false) {
        throw new Error(
          aiData.message || aiData.error || t("errors.analyzeFailed"),
        );
      }
      setGlobalProgress(85);

      // 4️⃣ Simpan hasil AI ke store lalu redirect ke halaman hasil
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
      router.push("/improve-linkedin/result-improve-linkedin");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error("LinkedIn Analysis Error:", err);
      setError(err.message || t("errors.processFailed"));
      setGlobalProgress(0);
      setGlobalUploading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl items-center pt-20 lg:pt-0">
      <section className="w-full">
        {/* Hero Section */}
        <div className="flex w-full items-center py-12 lg:min-h-screen lg:py-0">
          <div className="flex w-full items-center gap-10 px-6 lg:flex-row lg:px-0">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex-1"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-TextPrimary text-center text-2xl font-semibold md:text-3xl lg:text-start lg:text-4xl"
              >
                {t("hero.titlePrefix")}{" "}
                <span className="text-accentOrange">
                  {t("hero.titleHighlight")}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-TextSecondary mt-3 text-center text-lg lg:text-start"
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                className="mx-auto mt-8 w-full"
              >
                <h2 className="text-TextSecondary mb-2 font-medium">
                  {t("form.label")}
                </h2>
                <div className="flex w-full gap-2">
                  <input
                    type="text"
                    placeholder={t("form.placeholder")}
                    className="flex-1 rounded-full border px-4 py-3"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`flex items-center justify-center rounded-full px-3 py-3 text-white transition-colors ${
                      loading
                        ? "bg-primaryBlue/70 cursor-not-allowed"
                        : "bg-primaryBlue hover:bg-primaryBlue/90"
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <ArrowRight />
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-red-700">
                    {error}
                  </div>
                )}
                {!isLoggedIn && (
                  <div className="mt-2 text-sm text-gray-600">
                    {attemptsLeft > 0 ? (
                      <span>
                        {t("attempts.remainingPrefix")}{" "}
                        <span className="font-medium">{attemptsLeft}</span>{" "}
                        {t("attempts.remainingSuffix")}{" "}
                        <Link
                          href="/login"
                          className="text-primaryBlue hover:underline"
                        >
                          {t("attempts.login")}
                        </Link>{" "}
                        {t("attempts.unlimitedAccess")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-medium text-red-600">
                        <Lock size={16} /> {t("attempts.exhausted")}
                      </span>
                    )}
                  </div>
                )}
              </motion.div>
            </motion.div>

            {/* Illustration Section - Hidden below lg */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="hidden flex-1 lg:block"
            >
              <Image
                className="relative"
                draggable={false}
                src={illustration}
                alt={t("hero.imageAlt")}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        message={upgradeMessage}
      />
    </main>
  );
}
