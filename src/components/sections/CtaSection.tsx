"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

import CvDummy from "@/assets/img/cv-dummy.jpg";
import LinkedinDummy from "@/assets/img/linkedin-dummy.jpg";

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto w-full px-4 sm:px-6 py-12"
    >
      {/* Desktop/Tabel */}
      <div className="hidden flex-col gap-6 lg:flex lg:flex-row">
        {/* Left Panel */}
        <div className="bg-primaryBlue relative h-72 md:h-80 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm">
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primaryBlue via-primaryBlue/95 to-transparent" />

          {/* Content */}
          <div className="relative z-10 flex h-full max-w-sm flex-col justify-center px-4 sm:px-6">
            <p className="text-sm font-medium tracking-wide text-white/80">
              Tingkatkan Karier Anda
            </p>

            <h3 className="mt-2 text-2xl font-semibold leading-tight text-white md:text-3xl">
              Review CV & Karier dengan AI
            </h3>

            <p className="mt-3 text-sm text-white/75 md:text-base">
              Dapatkan insight profesional untuk CV, LinkedIn, dan arah karier
              Anda dalam hitungan detik.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="review-cv"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primaryBlue transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
              >
                Coba Review Karier
              </Link>

              <Link
                href="contoh"
                className="text-sm font-medium text-white/80 underline-offset-4 transition hover:underline"
              >
                Lihat Contoh
              </Link>
            </div>
          </div>

          {/* Image */}
          <Image
            alt="CV Dummy"
            src={CvDummy}
            draggable={false}
            className="
              absolute top-1/2 -translate-y-1/2 rotate-[-20deg] object-contain
              lg:right-[-100px] lg:h-[300px] lg:w-[300px]
              xl:right-[-140px] xl:h-[380px] xl:w-[380px]
              2xl:right-[-180px]
            "
            priority
          />
        </div>

        {/* Right Panel */}
        <div className="bg-accentOrange relative h-72 md:h-80 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm">
          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-accentOrange via-accentOrange/95 to-transparent" />

          {/* Content */}
          <div className="relative z-10 ml-auto flex h-full max-w-sm flex-col justify-center px-4 sm:px-6 text-right">
            <p className="text-sm font-medium tracking-wide text-white/80">
              Bangun Personal Branding
            </p>

            <h3 className="mt-2 text-2xl font-semibold leading-tight text-white md:text-3xl">
              Optimasi Profil LinkedIn
            </h3>

            <p className="mt-3 text-sm text-white/75 md:text-base">
              Perbaiki headline, summary, dan pengalaman kerja agar lebih
              menarik recruiter & HR.
            </p>

            <div className="mt-6 flex items-center justify-end gap-4">
              <Link
                href="review-linkedin"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-accentOrange transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
              >
                Review LinkedIn
              </Link>

              <Link
                href="contoh-linkedin"
                className="text-sm font-medium text-white/80 underline-offset-4 transition hover:underline"
              >
                Lihat Contoh
              </Link>
            </div>
          </div>

          {/* Image */}
          <Image
            alt="LinkedIn Dummy"
            src={LinkedinDummy}
            draggable={false}
            className="
              absolute top-1/2 -translate-y-1/2 rotate-[12deg] object-contain
              lg:left-[-160px] lg:h-[360px] lg:w-[360px]
              xl:left-[-230px] xl:h-[480px] xl:w-[480px]
              2xl:left-[-260px]
            "
            priority
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="relative mt-2 h-56 w-full overflow-hidden rounded-2xl border border-white/20 bg-primaryBlue shadow-sm lg:hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primaryBlue via-primaryBlue/95 to-primaryBlue/80" />

        <div className="relative z-10 flex h-full max-w-xs flex-col justify-center px-4">
          <p className="text-sm font-medium tracking-wide text-white/80">
            Tingkatkan Karier Anda
          </p>

          <h3 className="mt-1 text-xl font-semibold leading-tight text-white">
            Review Karier Berbasis AI
          </h3>

          <p className="mt-2 text-sm text-white/75">
            Dapatkan insight instan untuk profil profesional dan arah karier
            Anda.
          </p>

          <Link
            href="/review"
            className="mt-4 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primaryBlue transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Mulai Review
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