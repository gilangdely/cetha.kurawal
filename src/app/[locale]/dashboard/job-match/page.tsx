"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import UploadJobs from "@/components/upload-jobs";

export default function RekomendasiPekerjaanDashboard() {
  return (
    <div className="w-full p-4 md:px-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Rekomendasi Pekerjaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-6 mb-8">
        <h2 className="text-TextPrimary text-2xl md:text-3xl lg:text-4xl font-semibold">
          Temukan{" "}
          <span className="text-accentOrange">Pekerjaan yang Tepat</span>{" "}
          untukmu
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
