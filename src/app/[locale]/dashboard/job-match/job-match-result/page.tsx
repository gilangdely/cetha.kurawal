"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useJobResultStore } from "@/store/jobResultStore";

import {
  Briefcase,
  ChartNoAxesCombined,
  Handshake,
  Star,
  Wallet,
  ArrowLeft,
  Sparkles,
  Target,
  Rocket,
  BadgeDollarSign,
} from "lucide-react";

import NamedSectionResult from "@/components/named-section-result";
import JobLinksSection from "@/components/job-link-section";

export default function JobMatchResultPage() {
  const router = useRouter();
  const jobResult = useJobResultStore((state) => state.jobResult);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useJobResultStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useJobResultStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !jobResult) {
      router.push("/dashboard/job-match");
    }
  }, [hydrated, jobResult, router]);

  if (!hydrated || !jobResult) return null;

  const salaryLabels: Record<string, string> = {
    junior: "Entry Level",
    mid_level: "Mid Level",
    senior: "Senior Level",
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#f8fafc_100%)] p-7 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:p-8">
          <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />
          <div className="absolute -bottom-14 left-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />

          <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur">
            <Sparkles size={14} />
            Match Score Driven
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Pekerjaan yang paling cocok buat kamu
                </p>
                <h2 className="mt-1 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                  {jobResult.jabatan_ideal}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                  Role ini dipilih karena paling nyambung dengan fondasi skill
                  dan arah karier kamu saat ini, jadi lebih realistis untuk
                  dikejar sekaligus punya ruang naik level.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Target size={16} />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Best Fit
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Fokus ke role yang paling masuk akal untuk dilamar sekarang.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <Rocket size={16} />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Growth Path
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Ada ruang berkembang dari entry point ke level berikutnya.
                </p>
              </div>

              <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <BadgeDollarSign size={16} />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Salary Snapshot
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  Lihat range kompensasi untuk bantu set ekspektasi sejak awal.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="">
            <NamedSectionResult
              icon={<Handshake size={16} />}
              color="amber"
              eyebrow="Match Reason"
              title="Kenapa kamu cocok?"
              list={jobResult.alasan_kecocokan}
            />
          </section>

          <section className="">
            <NamedSectionResult
              icon={<Briefcase size={16} />}
              eyebrow="Job Preview"
              title="Deskripsi pekerjaan"
              list={jobResult.deskripsi_pekerjaan}
            />
          </section>

          <section className="">
            <NamedSectionResult
              icon={<ChartNoAxesCombined size={16} />}
              color="green"
              eyebrow="Career Direction"
              title="Potensi karier"
              list={jobResult.potensi_karir}
            />
          </section>

          <section className="">
            <NamedSectionResult
              icon={<Star size={16} />}
              color="amber"
              eyebrow="Bonus Edge"
              title="Kelebihan tambahan"
              list={jobResult.kelebihan_tambahan}
            />
          </section>
        </div>

        <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                Salary Snapshot
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Wallet size={18} />
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  Kisaran Gaji
                </h3>
              </div>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-slate-500">
              Gunakan ini sebagai benchmark awal saat memilih lowongan dan
              menyiapkan ekspektasi negosiasi.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Object.entries(jobResult.kisaran_gaji).map(([level, salary]) => (
              <div
                key={level}
                className="group rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-5 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="mb-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold tracking-wide text-slate-600 uppercase">
                  {salaryLabels[level] || level}
                </div>

                <p className="text-2xl font-semibold tracking-tight text-slate-900">
                  {salary}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Estimasi umum yang bisa jadi acuan saat mulai melamar.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
          <JobLinksSection jobResult={jobResult} />
        </section>

        <div className="flex justify-center">
          <button
            onClick={() => router.push("/dashboard/job-match")}
            className="bg-primaryBlue hover:bg-primaryBlueHover inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            Cek CV Lain
          </button>
        </div>
      </motion.div>
    </div>
  );
}
