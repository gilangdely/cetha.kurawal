"use client";

import UploadJobs from "@/components/upload-jobs-dashboard";
import { useTranslations } from "next-intl";

export default function RekomendasiPekerjaanDashboard() {
  const t = useTranslations("dashboardJobMatchPage");

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
          {t("title")}
        </h2>
        <p className="text-TextSecondary mt-2 max-w-2xl text-base">
          {t("description")}
        </p>
      </div>
      <UploadJobs />
    </div>
  );
}
