"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import CvDummy from "@/assets/img/cv-dummy.jpg";
import LinkedinDummy from "@/assets/img/linkedin-dummy.jpg";
import Image from "next/image";

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto w-full px-6 py-16"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primaryBlue relative h-80 w-full overflow-hidden rounded-2xl border border-white/20 shadow-sm">
          {/* Gradient overlay (pemisah visual) */}
          <div className="from-primaryBlue via-primaryBlue/95 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent" />

          {/* Left */}
          <div className="relative z-10 flex h-full max-w-sm flex-col justify-center px-4 md:px-6">
            <p className="text-sm font-medium tracking-wide text-white/80">
              Tingkatkan Karier Anda
            </p>

            <h3 className="mt-2 text-2xl leading-tight font-semibold text-white md:text-3xl">
              Review CV & Karier dengan AI
            </h3>

            <p className="mt-3 text-sm text-white/75 md:text-base">
              Dapatkan insight profesional untuk CV, LinkedIn, dan arah karier
              Anda dalam hitungan detik.
            </p>

            <div className="mt-6 flex items-center gap-4">
              <Link
                href="review-cv"
                className="text-primaryBlue rounded-full bg-white px-6 py-3 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] hover:bg-white/90 active:scale-[0.98]"
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

          {/* Right */}
          <Image
            alt="CV Dummy"
            src={CvDummy}
            className="absolute top-1/2 right-[-70px] h-[380px] w-[380px] -translate-y-1/2 rotate-[-20deg] object-contain"
            priority
          />
        </div>

        <div className="bg-accentOrange relative h-80 w-full overflow-hidden rounded-2xl border shadow-sm">
          <Image
            alt="Linkedin Dummy"
            src={LinkedinDummy}
            className="absolute top-45 left-[-100] h-[480px] w-[480px] -translate-y-1/2 rotate-[12deg] object-contain"
            priority
          />
        </div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
