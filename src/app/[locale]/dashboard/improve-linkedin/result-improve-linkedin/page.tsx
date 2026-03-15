"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import LinkedInAnalysisResult from "@/components/linkedin-analysis";
import LinkedInProfileDisplay from "@/components/linkedin-profile-card";
import { useLinkedinResultStore } from "@/store/linkedinResultStore";
import { useTranslations } from "next-intl";

export default function ResultImproveLinkedinDashboardPage() {
  const t = useTranslations("dashboardImproveLinkedinResultPage");
  const router = useRouter();
  const profile = useLinkedinResultStore((state) => state.profile);
  const analysis = useLinkedinResultStore((state) => state.analysis);
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
      router.push("/dashboard/improve-linkedin");
    }
  }, [hydrated, profile, analysis, router]);

  if (!hydrated || !profile || !analysis) return null;

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-TextPrimary text-3xl font-semibold">
          {t("title")}
        </h1>
        <p className="text-TextSecondary mt-2 max-w-2xl text-base">
          {t("description")}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="space-y-10"
      >
        <LinkedInProfileDisplay profile={profile} />
        <LinkedInAnalysisResult result={analysis} />
      </motion.div>
    </div>
  );
}
