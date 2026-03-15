"use client";

import UploadCv from "@/components/upload-cv-dashboard";

export default function ReviewCVDashboard() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
          CV Lebih Baik, Peluang Lebih Besar
        </h2>
        <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
          Dapatkan feedback otomatis dari AI agar CV kamu makin standout di mata
          recruiter.
        </p>
      </div>

      <UploadCv />
    </div>
  );
}
