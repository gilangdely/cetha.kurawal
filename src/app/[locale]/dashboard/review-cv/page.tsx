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
import UploadCv from "@/components/upload-cv";

export default function ReviewCVDashboard() {
  return (
    <div className="w-full  p-4 md:px-10">
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
      <div className="mt-6 mb-8">
        <h2 className="text-TextPrimary text-2xl md:text-3xl lg:text-4xl font-semibold">
          CV Lebih Baik,{" "}
          <span className="text-accentOrange">Peluang Lebih Besar</span>
        </h2>
        <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
          Dapatkan feedback otomatis dari AI agar CV kamu makin standout di mata
          recruiter. Hasil review akan disimpan untuk dilihat kembali.
        </p>
      </div>
      <UploadCv />

    </div>
  );
}
