"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import LinkedInAnalysisResult from "@/components/linkedin-analysis";
import LinkedInProfileDisplay from "@/components/linkedin-profile-card";
import { useLinkedinResultStore } from "@/store/linkedinResultStore";

export default function ResultImproveLinkedinPage() {
  const t = useTranslations("improveLinkedinResultPage");
  const router = useRouter();
  const profile = useLinkedinResultStore((state) => state.profile);
  const analysis = useLinkedinResultStore((state) => state.analysis);
  const clearResult = useLinkedinResultStore((state) => state.clearResult);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useLinkedinResultStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useLinkedinResultStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && (!profile || !analysis)) {
      router.push("/improve-linkedin");
    }
  }, [hydrated, profile, analysis, router]);

  if (!hydrated || !profile || !analysis) return null;

  return (
    <main className="mx-auto mt-12 w-full max-w-7xl px-4 py-10 md:mt-14 md:px-8 lg:px-10">
      <div className="mb-8">
        <div>
          <h1 className="text-TextPrimary text-2xl font-semibold sm:text-3xl">
            {t("title")}
          </h1>
          <p className="text-TextSecondary mt-2 max-w-2xl text-sm sm:text-base">
            {t("description")}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-8"
      >
        <LinkedInProfileDisplay profile={profile} />
        <LinkedInAnalysisResult result={analysis} />
      </motion.div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => {
            clearResult();
            router.push("/improve-linkedin");
          }}
          className="bg-primaryBlue flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 sm:px-7"
        >
          <ArrowRight className="rotate-180" size={16} />
          {t("reviewAnotherButton")}
        </button>
      </div>
    </main>
  );
}
