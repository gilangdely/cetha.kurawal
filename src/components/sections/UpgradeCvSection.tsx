import React, { useState } from "react";
import UploadCard from "@/components/ui/upload-card";
import { ArrowDownRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  itemFadeUp,
  sectionFadeUp,
  sectionViewport,
} from "../../lib/animations/section-motion";

const UpgradeCvSection = () => {
  const t = useTranslations("CvUpgrade");
  const [openImprovements, setOpenImprovements] = useState<number[]>([]);

  const toggleImprovement = (index: number) => {
    setOpenImprovements((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const penilaian_per_kategori = {
    dampak_pengalaman_kerja: 84,
  };

  const skor_keseluruhan = 82;

  const improvements = t.raw("step3.improvements") as Array<{
    point: string;
    explanation: string;
  }>;

  return (
    <motion.section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <motion.div
        variants={sectionFadeUp}
        initial="hidden"
        whileInView="show"
        viewport={sectionViewport}
        className="flex flex-col items-center text-center"
      >
        <div className="border-primaryBlue/40 bg-primaryBlue/5 rounded-full border px-3 py-1">
          <p className="text-primaryBlue text-sm font-medium tracking-wide">
            {t("badge")}
          </p>
        </div>
        <div className="mt-4 max-w-2xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            {t("hero.title")}
          </h2>
          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            {t("hero.description")}
          </p>
        </div>
      </motion.div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1. Upload Card */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <div className="flex justify-center">
            <UploadCard />
          </div>

          <div className="my-6 h-px w-full bg-gray-100" />

          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {t("step1.title")}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              {t("step1.description")}
            </p>
          </div>
        </motion.div>

        {/* 2. Skor dan Kekuatan CV */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          transition={{ delay: 0.05 }}
          className="min-h-[260px] rounded-2xl bg-white p-8 shadow-sm md:col-span-2"
        >
          {/* Header */}
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              {t("step2.title")}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {t("step2.description")}
            </p>
          </div>

          <div className="my-4 h-px w-full bg-gray-100" />

          {/* Content */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            {/* Progress Section */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {t("step2.impactLabel")}
                </p>

                <span className="text-primaryBlue text-sm font-semibold">
                  {penilaian_per_kategori.dampak_pengalaman_kerja}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-blue-50">
                <div
                  className="bg-primaryBlue h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${penilaian_per_kategori.dampak_pengalaman_kerja}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                {t("step2.impactDescription")}
              </p>
            </div>

            {/* Score Section */}
            <div className="flex justify-center md:flex-none md:justify-center">
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  {t("step2.overallScore")}
                </p>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-inner">
                  <span className="text-primaryBlue text-xl font-bold">
                    {skor_keseluruhan}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-gray-500">
                  {t("step2.aboveAverage")}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 3. Saran dan Perbaikan */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          transition={{ delay: 0.08 }}
          className="min-h-[260px] rounded-2xl bg-white p-8 shadow-sm md:col-span-2"
        >
          {/* Header */}
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              {t("step3.title")}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              {t("step3.description")}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Content */}
          <div className="flex justify-center">
            <div className="w-full">
              <ul className="space-y-2">
                {improvements.map((item, i) => (
                  <li key={i}>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/40 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/40">
                      <button
                        type="button"
                        onClick={() => toggleImprovement(i)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 transition-colors hover:text-amber-600 focus:outline-none"
                      >
                        <span>{item.point}</span>

                        <span
                          className={`transition-transform duration-300 ${
                            openImprovements.includes(i)
                              ? "rotate-180 text-amber-500"
                              : ""
                          }`}
                        >
                          <ArrowDownRight className="h-4 w-4 text-gray-400" />
                        </span>
                      </button>

                      {openImprovements.includes(i) && (
                        <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* 4. Cta */}
        <motion.div
          variants={itemFadeUp}
          initial="hidden"
          whileInView="show"
          viewport={sectionViewport}
          transition={{ delay: 0.12 }}
          className="bg-primaryBlue flex min-h-[260px] flex-col justify-between rounded-2xl p-8 text-white shadow-lg"
        >
          <div>
            <h3 className="text-xl leading-snug font-semibold">
              {t("cta.title")}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/80">
              {t("cta.description")}
            </p>
          </div>

          <div className="mt-6">
            <button className="text-primaryBlue w-full rounded-xl bg-white py-3 text-sm font-semibold transition hover:bg-gray-100">
              {t("cta.button")}
            </button>

            <p className="mt-3 text-center text-xs text-white/70">
              {t("cta.footnote")}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default UpgradeCvSection;
