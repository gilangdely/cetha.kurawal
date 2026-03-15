"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useJobResultStore } from "@/store/jobResultStore";
import { useTranslations } from "next-intl";
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
import Image from "next/image";
import Link from "next/link";
import JobLinksSection from "@/components/job-link-section";
import NamedSectionResult from "@/components/named-section-result";

import cardImg from "@/assets/img/article1.jpg";

export default function HasilRekomendasiPage() {
  const t = useTranslations("jobMatchResultPage");
  const router = useRouter();
  const jobResult = useJobResultStore((state) => state.jobResult);
  const clearJobResult = useJobResultStore((state) => state.clearJobResult);
  const [hydrated, setHydrated] = useState(false);

  const salaryLabels: Record<string, string> = {
    junior: t("salary.levels.junior"),
    mid_level: t("salary.levels.midLevel"),
    senior: t("salary.levels.senior"),
  };

  useEffect(() => {
    const unsub = useJobResultStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useJobResultStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !jobResult) {
      router.push("/job-match");
    }
  }, [hydrated, jobResult, router]);

  if (!hydrated || !jobResult) return null;

  return (
    <main className="mx-auto mt-12 flex w-full max-w-7xl items-start gap-6 px-4 py-10 md:mt-14 md:px-8 lg:gap-8 lg:px-10">
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="sticky top-24 hidden w-64 flex-shrink-0 lg:block xl:w-72"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-32 w-full bg-gradient-to-br from-indigo-50 to-blue-100">
            <Image
              src={cardImg}
              alt={t("aside.card.imageAlt")}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-TextPrimary mb-3 text-sm font-semibold">
              {t("aside.card.title")}
            </h3>
            <Link
              href="/review-cv"
              className="bg-primaryBlue block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t("aside.card.button")}
            </Link>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold tracking-wide text-amber-600 uppercase">
            {t("aside.insight.badge")}
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            {t("aside.insight.description")}
          </p>
        </div>
      </motion.aside>

      <section className="min-w-0 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-8"
        >
          <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#f8fafc_100%)] p-7 shadow-[0_16px_50px_rgba(15,23,42,0.06)] md:p-8">
            <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-sky-200/30 blur-3xl" />
            <div className="absolute -bottom-14 left-10 h-32 w-32 rounded-full bg-amber-200/30 blur-3xl" />

            <div className="absolute top-5 right-5 hidden items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3 py-1 text-xs font-semibold text-sky-700 backdrop-blur md:flex">
              <Sparkles size={14} />
              {t("hero.badge")}
            </div>

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-start gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {t("hero.kicker")}
                  </p>
                  <h2 className="mt-1 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                    {jobResult.jabatan_ideal}
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
                    {t("hero.description")}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Target size={16} />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      {t("cards.bestFit.title")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {t("cards.bestFit.description")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <Rocket size={16} />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      {t("cards.growthPath.title")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {t("cards.growthPath.description")}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/70 bg-white/75 p-4 backdrop-blur-sm">
                  <div className="mb-2 flex items-center gap-2 text-slate-500">
                    <BadgeDollarSign size={16} />
                    <span className="text-xs font-semibold tracking-wide uppercase">
                      {t("cards.salarySnapshot.title")}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {t("cards.salarySnapshot.description")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <section>
              <NamedSectionResult
                icon={<Handshake size={16} />}
                color="amber"
                eyebrow={t("sections.matchReason.eyebrow")}
                title={t("sections.matchReason.title")}
                list={jobResult.alasan_kecocokan}
              />
            </section>

            <section>
              <NamedSectionResult
                icon={<Briefcase size={16} />}
                eyebrow={t("sections.jobPreview.eyebrow")}
                title={t("sections.jobPreview.title")}
                list={jobResult.deskripsi_pekerjaan}
              />
            </section>

            <section>
              <NamedSectionResult
                icon={<ChartNoAxesCombined size={16} />}
                color="green"
                eyebrow={t("sections.careerDirection.eyebrow")}
                title={t("sections.careerDirection.title")}
                list={jobResult.potensi_karir}
              />
            </section>

            <section>
              <NamedSectionResult
                icon={<Star size={16} />}
                color="amber"
                eyebrow={t("sections.bonusEdge.eyebrow")}
                title={t("sections.bonusEdge.title")}
                list={jobResult.kelebihan_tambahan}
              />
            </section>
          </div>

          <section className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
                  {t("salary.badge")}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <Wallet size={18} />
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">
                    {t("salary.title")}
                  </h3>
                </div>
              </div>

              <p className="max-w-md text-sm leading-relaxed text-slate-500">
                {t("salary.description")}
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
                    {t("salary.cardHint")}
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
              onClick={() => {
                clearJobResult();
                router.push("/job-match");
              }}
              className="bg-primaryBlue inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              <ArrowLeft size={16} />
              {t("backButton")}
            </button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
