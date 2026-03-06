"use client";

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CircleCheck } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";

import illustration from "@/assets/img/illustration-hero.jpg";

const HeroSection = () => {
  const t = useTranslations("Hero");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="mx-auto mt-6 flex w-full max-w-7xl items-center lg:mt-0 lg:min-h-screen lg:px-6"
    >
      <div className="flex w-full flex-col-reverse items-center gap-6 px-6 pt-16 pb-12 md:flex-row md:pt-24 lg:gap-10 lg:px-0 lg:pt-0">
        {/* LEFT */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-TextPrimary text-2xl font-semibold lg:text-4xl">
            <span className="text-accentOrange">{t("headlineHighlight")}</span>{" "}
            {t("headlineText")}
          </h2>

          <div className="mt-3 flex flex-col gap-3">
            <p className="text-TextSecondary lg:text-lg">{t("description")}</p>

            <div className="mt-3 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center">
              {/* Secondary CTA */}
              <Link
                href="/tingkatkan-linkedIn"
                className="group border-primaryBlue text-primaryBlue hover:border-primaryBlueHover hover:bg-primaryBlue/5 hover:text-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center rounded-full border-2 px-6 py-2.5 transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-fit"
              >
                <span className="font-medium whitespace-nowrap">
                  {t("ctaSecondary")}
                </span>
              </Link>

              {/* Primary CTA */}
              <Link
                href={isLoggedIn ? "/review-cv" : "/login"}
                className="group bg-primaryBlue hover:bg-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 font-semibold text-white shadow-sm transition-all duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] md:w-fit"
              >
                <span className="whitespace-nowrap">
                  {isLoggedIn ? t("ctaPrimary") : t("ctaLogin")}
                </span>

                <Send
                  height={20}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="mt-2 flex gap-5 lg:mt-3">
              <p className="flex items-center gap-2 text-sm">
                <CircleCheck className="text-primaryBlue" />
                <span className="text-TextSecondary">
                  {t("benefits.freeTrial")}
                </span>
              </p>

              <p className="flex items-center gap-2 text-sm">
                <CircleCheck className="text-primaryBlue" />
                <span className="text-TextSecondary">
                  {t("benefits.jobMatch")}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT */}
        <motion.div
          className="relative flex-1 overflow-visible"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative overflow-visible">
            <Image
              src={illustration}
              alt={t("imageAlt")}
              draggable={false}
              priority
              className="overflow-visible"
            />
          </div>

          {/* Lingkaran 1 - Kiri Atas */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[12%] left-[8%] z-10"
            animate={{
              y: [-10, 10, -10],
              scale: [1, 1.06, 1],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0,
            }}
          >
            <div className="h-8 w-8 rounded-full border-2 border-[#2c2a35]" />
          </motion.div>

          {/* Lingkaran 2 - Kanan Tengah */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[40%] right-[-10%] z-10 hidden md:block"
            animate={{
              y: [8, -8, 8],
              x: [6, -6, 6],
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.85, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <div className="h-10 w-10 rounded-full border-2 border-[#2c2a35]" />
          </motion.div>

          {/* Lingkaran 3 - Bawah Kiri */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[60%] left-[-3%] z-10"
            animate={{
              y: [-8, 8, -8],
              x: [-6, 4, -6],
              scale: [1, 1.04, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.6,
            }}
          >
            <div className="h-6 w-6 rounded-full border-2 border-[#2c2a35]" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
