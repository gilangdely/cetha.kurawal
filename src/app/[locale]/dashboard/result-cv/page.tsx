"use client";

import GoodThingSection from "@/components/good-things-dashboard";
import NeedImprovementSection from "@/components/need-improvement-dashboard";
import CvReviewResult from "@/components/cv-review-result";

export default function ReviewCVDashboardPage() {
  return (
    <div className="w-full">
      <div className="space-y-8">
        <div>
          <h1 className="text-TextPrimary text-3xl font-semibold">
            Hasil Review CV Kamu
          </h1>
          <p className="text-TextSecondary mt-2 max-w-2xl text-base">
            Berikut hasil analisis AI terhadap CV yang telah kamu unggah.
            Dapatkan insight tentang apa yang sudah bagus dan apa yang bisa
            ditingkatkan.
          </p>
        </div>

        {/* Sections */}
        <div className="my-8 grid gap-8">
          {/* <GoodThingSection />
        <NeedImprovementSection /> */}
          <CvReviewResult />
        </div>
      </div>
    </div>
  );
}
