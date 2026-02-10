"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Send, CircleCheck } from "lucide-react";

import illustration from "@/assets/img/illustration-hero.jpg";

const HeroSection = () => {
  const t = useTranslations("Hero");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="mx-auto flex w-full max-w-7xl items-center lg:min-h-screen lg:px-6"
    >
      <div className="flex w-full flex-col-reverse items-center gap-2 px-6 pt-16 pb-12 md:flex-row md:pt-24 lg:gap-10 lg:px-0 lg:pt-0">
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

            <Link
              href="/login"
              className="bg-primaryBlue mt-2 flex w-full items-center justify-center gap-2 rounded-full px-4.5 py-3 font-medium text-white md:w-fit lg:mt-5"
            >
              <span>{t("cta")}</span>
              <Send height={20} />
            </Link>

            <div className="mt-2 flex gap-5 lg:mt-3">
              <p className="flex gap-2 text-sm">
                <CircleCheck className="text-primaryBlue" />
                <span className="text-TextSecondary">
                  {t("benefits.freeTrial")}
                </span>
              </p>

              <p className="flex gap-2 text-sm">
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
          className="flex-1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <Image
            src={illustration}
            alt={t("imageAlt")}
            draggable={false}
            priority
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
