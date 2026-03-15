"use client";

import Image from "next/image";
import UploadCv from "@/components/upload-cv";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import illustration from "@/assets/img/illustration-review-cv.jpg";

export default function ReviewCVPage() {
  const t = useTranslations("reviewCvPage");

  return (
    <main className="mx-auto flex w-full max-w-7xl items-center pt-20 lg:pt-0">
      <section className="w-full">
        {/* Hero Section */}
        <div className="flex w-full items-center py-12 lg:min-h-screen lg:py-0">
          <div className="flex w-full items-center gap-10 px-6 lg:flex-row lg:px-0">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex-1 lg:mt-24"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl"
              >
                {t("hero.titlePrefix")}{" "}
                <span className="text-accentOrange">
                  {t("hero.titleHighlight")}
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="text-TextSecondary mt-3 text-lg"
              >
                {t("hero.description")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <UploadCv />
              </motion.div>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="hidden flex-1 lg:block"
            >
              <Image
                className="relative"
                draggable={false}
                src={illustration}
                alt={t("hero.imageAlt")}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
