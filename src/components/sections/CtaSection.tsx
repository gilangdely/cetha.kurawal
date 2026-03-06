"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

import CvDummy from "@/assets/img/cv-dummy.jpg";
import LinkedinDummy from "@/assets/img/linkedin-dummy.jpg";

const CtaSection = () => {
  const t = useTranslations("CtaSection");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto w-full px-4 py-12 sm:px-6 md:pt-20"
    >
      {/* Desktop/Tabel */}
      <div className="hidden flex-col gap-6 lg:flex lg:flex-row">
        {/* Left Panel */}
        <div className="bg-primaryBlue relative h-72 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm md:h-80">
          <div className="from-primaryBlue via-primaryBlue/95 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent" />

          <div className="relative z-10 flex h-full max-w-sm flex-col justify-center px-4 sm:px-6">
            <p className="text-sm font-medium tracking-wide text-white/80">
              {t("cvPanel.badge")}
            </p>

            <h3 className="mt-2 text-2xl leading-tight font-semibold text-white md:text-3xl">
              {t("cvPanel.title")}
            </h3>

            <p className="mt-3 text-sm text-white/75 md:text-base">
              {t("cvPanel.description")}
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="review-cv"
                className="text-primaryBlue rounded-full bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
              >
                {t("cvPanel.primaryCta")}
              </Link>

              <Link
                href="contoh"
                className="text-sm font-medium text-white/80 underline-offset-4 transition hover:underline"
              >
                {t("cvPanel.secondaryCta")}
              </Link>
            </div>
          </div>

          <Image
            alt="CV Dummy"
            src={CvDummy}
            draggable={false}
            className="absolute top-1/2 -translate-y-1/2 rotate-[-20deg] object-contain lg:right-[-100px] lg:h-[300px] lg:w-[300px] xl:right-[-140px] xl:h-[380px] xl:w-[380px] 2xl:right-[-180px]"
            priority
          />
        </div>

        {/* Right Panel */}
        <div className="bg-accentOrange relative h-72 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm md:h-80">
          <div className="from-accentOrange via-accentOrange/95 pointer-events-none absolute inset-0 bg-gradient-to-l to-transparent" />

          <div className="relative z-10 ml-auto flex h-full max-w-sm flex-col justify-center px-4 text-right sm:px-6">
            <p className="text-sm font-medium tracking-wide text-white/80">
              {t("linkedinPanel.badge")}
            </p>

            <h3 className="mt-2 text-2xl leading-tight font-semibold text-white md:text-3xl">
              {t("linkedinPanel.title")}
            </h3>

            <p className="mt-3 text-sm text-white/75 md:text-base">
              {t("linkedinPanel.description")}
            </p>

            <div className="mt-6 flex items-center justify-end gap-4">
              <Link
                href="review-linkedin"
                className="text-accentOrange rounded-full bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
              >
                {t("linkedinPanel.primaryCta")}
              </Link>

              <Link
                href="contoh-linkedin"
                className="text-sm font-medium text-white/80 underline-offset-4 transition hover:underline"
              >
                {t("linkedinPanel.secondaryCta")}
              </Link>
            </div>
          </div>

          <Image
            alt="LinkedIn Dummy"
            src={LinkedinDummy}
            draggable={false}
            className="absolute top-1/2 -translate-y-1/2 rotate-[12deg] object-contain lg:left-[-160px] lg:h-[360px] lg:w-[360px] xl:left-[-230px] xl:h-[480px] xl:w-[480px] 2xl:left-[-260px]"
            priority
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="bg-primaryBlue relative mt-2 h-56 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm lg:hidden">
        <div className="from-primaryBlue via-primaryBlue/95 to-primaryBlue/80 pointer-events-none absolute inset-0 bg-gradient-to-r" />

        <div className="relative z-10 flex h-full max-w-xs flex-col justify-center px-4">
          <p className="text-sm font-medium tracking-wide text-white/80">
            {t("mobile.badge")}
          </p>

          <h3 className="mt-1 text-xl leading-tight font-semibold text-white">
            {t("mobile.title")}
          </h3>

          <p className="mt-2 text-sm text-white/75">
            {t("mobile.description")}
          </p>

          <Link
            href="/review"
            className="text-primaryBlue mt-4 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t("mobile.primaryCta")}
          </Link>
        </div>

        <Image
          alt="Career Illustration"
          src={CvDummy}
          draggable={false}
          className="absolute top-1/2 right-[-80px] h-[220px] w-[220px] -translate-y-1/2 rotate-[-20deg] object-contain"
          priority
        />
      </div>
    </motion.section>
  );
};

export default CtaSection;
