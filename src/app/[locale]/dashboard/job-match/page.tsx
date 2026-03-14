"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import UploadJobs from "@/components/upload-jobs-dashboard";
import { useJobResultStore } from "@/store/jobResultStore";
import { RotateCcw, Briefcase, Handshake, ChartNoAxesCombined, Wallet, Star } from "lucide-react";
import { motion } from "framer-motion";
import NamedSectionResult from "@/components/named-section-result";
import JobLinksSection from "@/components/job-link-section";

export default function RekomendasiPekerjaanDashboard() {
  const jobResult = useJobResultStore((state) => state.jobResult);
  const clearJobResult = useJobResultStore((state) => state.clearJobResult);
  const hasResult = !!jobResult;

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

      {!hasResult ? (
        <>
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
        </>
      ) : (
        <>
          <div className="mt-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
                Hasil Rekomendasi Pekerjaan
              </h1>
              <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
                Berdasarkan hasil analisis CV kamu, berikut pekerjaan yang cocok
                beserta alasan dan potensi karier yang bisa kamu kembangkan.
              </p>
            </div>
            <button
              onClick={clearJobResult}
              className="bg-primaryBlue flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <RotateCcw size={16} />
              Coba CV Lain
            </button>
          </div>

          <section className="w-full flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="mb-6 flex items-center gap-3">
                <Briefcase className="text-blue-600" size={26} />
                <h2 className="text-TextPrimary text-2xl font-semibold">
                  {jobResult.jabatan_ideal}
                </h2>
              </div>

              <NamedSectionResult
                icon={<Handshake size={16} />}
                color="amber"
                className="mt-4"
                title="Alasan Kecocokan"
                list={jobResult.alasan_kecocokan}
              />
              <NamedSectionResult
                icon={<Briefcase size={16} />}
                className="mt-4"
                title="Deskripsi Pekerjaan"
                list={jobResult.deskripsi_pekerjaan}
              />
              <NamedSectionResult
                icon={<ChartNoAxesCombined size={16} />}
                color="green"
                className="mt-4"
                title="Potensi Karier"
                list={jobResult.potensi_karir}
              />

              <div className="mt-6 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center gap-2.5 rounded-t-xl border-b border-gray-100 bg-gray-50 p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Wallet size={16} />
                  </div>
                  <h3 className="text-TextPrimary text-lg font-semibold">
                    Kisaran Gaji
                  </h3>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {Object.entries(jobResult.kisaran_gaji).map(
                      ([level, salary]) => (
                        <div
                          key={level}
                          className="rounded-lg border border-blue-100 p-4 text-center transition-all hover:shadow-md"
                        >
                          <p className="text-md mb-1 font-medium text-gray-500 capitalize">
                            {level}
                          </p>
                          <p className="text-lg font-semibold text-blue-700">
                            {salary}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <NamedSectionResult
                className="mt-4"
                icon={<Star size={16} />}
                color="amber"
                title="Kelebihan Tambahan"
                list={jobResult.kelebihan_tambahan}
              />

              <div className="mt-4">
                <JobLinksSection jobResult={jobResult} />
              </div>
            </motion.div>
          </section>
        </>
      )}
    </div>
  );
}
