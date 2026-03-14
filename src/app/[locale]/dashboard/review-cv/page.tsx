// filepath: d:\Projectan\cetha\src\app\dashboard\review-cv\page.tsx
"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import UploadCv from "@/components/upload-cv-dashboard";
import CvReviewResult from "@/components/cv-review-result";
import { useDataReviewStore } from "@/store/dataReviewStore";
import { RotateCcw } from "lucide-react";

export default function ReviewCVDashboard() {
  const reviewData = useDataReviewStore((state) => state.reviewData);
  const clearReviewData = useDataReviewStore((state) => state.clearReviewData);
  const hasResult = !!reviewData?.result;

  return (
    <div className="w-full p-4 md:px-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Review CV</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!hasResult ? (
        <>
          <div className="mt-6 mb-8">
            <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
              CV Lebih Baik,{" "}
              <span className="text-accentOrange">Peluang Lebih Besar</span>
            </h2>
            <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
              Dapatkan feedback otomatis dari AI agar CV kamu makin standout di
              mata recruiter. Hasil review akan disimpan untuk dilihat kembali.
            </p>
          </div>
          <UploadCv />
        </>
      ) : (
        <>
          <div className="mt-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
                Hasil Review CV Kamu
              </h1>
              <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
                Berikut hasil analisis AI terhadap CV yang telah kamu unggah.
              </p>
            </div>
            <button
              onClick={clearReviewData}
              className="bg-primaryBlue flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <RotateCcw size={16} />
              Review CV Lain
            </button>
          </div>
          <div className="grid gap-8">
            <CvReviewResult />
          </div>
        </>
      )}
    </div>
  );
}
