"use client";

import UploadJobs from "@/components/upload-jobs-dashboard";

export default function RekomendasiPekerjaanDashboard() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
          Temukan Pekerjaan yang Tepat untukmu
        </h2>
        <p className="text-TextSecondary mt-2 max-w-2xl text-base">
          Dapatkan rekomendasi pekerjaan yang paling sesuai dengan keahlian dan
          pengalamanmu, langsung dari analisis CV kamu.
        </p>
      </div>
      <UploadJobs />
    </div>
  );
}
