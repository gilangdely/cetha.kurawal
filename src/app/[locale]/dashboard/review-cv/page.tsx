"use client";

import UploadCv from "@/components/upload-cv-dashboard";
import { useTranslations } from "next-intl";

export default function ReviewCVDashboard() {
  const t = useTranslations("dashboardReviewCvPage");

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
          {t("title")}
        </h2>
        <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
          {t("description")}
        </p>
      </div>

      <UploadCv />
    </div>
  );
}
