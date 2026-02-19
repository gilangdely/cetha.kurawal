"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Sparkle } from "lucide-react";
import { useTranslations } from "next-intl";

import illustration from "@/assets/img/illustration-optimize-linkedIn.jpg";

const ImproveLinkedinSection = () => {
  const t = useTranslations("ImproveLinkedin");

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto w-full max-w-7xl px-6 py-12"
    >
      <div className="flex w-full flex-col-reverse items-center gap-10 px-6 md:flex-row lg:px-0">
        {/* Left (Image) */}
        <motion.div
          className="relative hidden md:block md:flex-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Image
            src={illustration}
            alt="imageAlt"
            className="h-auto w-full object-contain"
          />

          {/* Lingkaran 1 - Kiri Atas */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[4%] left-[6%] z-10"
            animate={{
              y: [-6, 6, -6],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="h-5 w-5 rounded-full border-2 bg-[#dddffe]" />
          </motion.div>

          {/* Lingkaran 2 - Bawah Kiri */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[66%] left-[0%] z-10"
            animate={{
              x: [-10, 8, -10],
              y: [2, -2, 2],
              opacity: [0.4, 0.75, 0.4],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
          >
            <div className="h-6 w-6 rounded-full border-2 bg-[#dddffe]" />
          </motion.div>

          {/* Lingkaran 3 - Bawah Kanan */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-[70%] right-[3%] z-10"
            animate={{
              y: [-6, 6, -6],
              scale: [1, 1.12, 1],
              opacity: [0.45, 0.85, 0.45],
            }}
            transition={{
              duration: 7.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4,
            }}
          >
            <div className="h-6 w-6 rounded-full border-2 bg-[#8e95fb]" />
          </motion.div>
        </motion.div>

        {/* Right (Content) */}
        <motion.div
          className="max-w-2xl flex-1 text-end"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <div className="border-primaryBlue/40 bg-primaryBlue/5 rounded-full border px-3 py-1">
              <p className="text-primaryBlue text-sm font-medium tracking-wide">
                {t("badge")}
              </p>
            </div>
          </motion.div>

          {/* Title & Description */}
          <motion.div
            className="mt-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <motion.h2
              className="text-TextPrimary text-2xl font-semibold lg:text-3xl"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("title")}
            </motion.h2>

            <motion.p
              className="text-TextSecondary mt-2 ml-auto max-w-2xl text-base lg:text-lg"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              {t("description")}
            </motion.p>
          </motion.div>

          {/* Feature Chips */}
          <motion.div
            className="mt-6 flex flex-wrap justify-end gap-3 text-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {[
              "Optimized headline",
              "Keyword strategy",
              "Recruiter-ready profile",
            ].map((label) => (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 6 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="group border-primaryBlue/20 bg-primaryBlue/5 hover:border-primaryBlue/40 hover:bg-primaryBlue/10 flex items-center gap-2 rounded-full border px-4 py-2 transition-colors duration-200"
              >
                <Sparkle
                  size={14}
                  className="text-primaryBlue/60 group-hover:text-primaryBlue transition-colors duration-200"
                />
                <span className="text-TextSecondary group-hover:text-primaryBlue font-medium transition-colors duration-200">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-6 flex justify-end"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            viewport={{ once: true }}
          >
            <Link
              href="/tingkatkan-linkedIn"
              className="group bg-primaryBlue hover:bg-primaryBlueHover shadow-primaryBlue/30 hover:shadow-primaryBlue/25 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <MoveLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span>{t("cta")}</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ImproveLinkedinSection;
