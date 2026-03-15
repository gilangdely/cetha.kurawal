"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

import icons1 from "@/assets/icons/pencils-quils.svg";
import icons2 from "@/assets/icons/human-resources.svg";
import icons3 from "@/assets/icons/jobs-search.svg";
import { useTranslations } from "next-intl";
import {
  itemFadeUp,
  sectionFadeUp,
  sectionViewport,
} from "../../lib/animations/section-motion";

const Cards = [
  {
    id: 1,
    image: icons1,
    titleKey: "cards.cv.title",
    descriptionKey: "cards.cv.description",
    link: "/review-cv",
  },
  {
    id: 2,
    image: icons2,
    titleKey: "cards.linkedin.title",
    descriptionKey: "cards.linkedin.description",
    link: "/improve-linkedin",
  },
  {
    id: 3,
    image: icons3,
    titleKey: "cards.jobs.title",
    descriptionKey: "cards.jobs.description",
    link: "/review-cv",
  },
];

const AdventagesSection = () => {
  const t = useTranslations("Advantages");

  return (
    <section className="mx-auto w-full max-w-7xl px-6 pb-12">
      {/* Title */}
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

        <div className="mt-4 max-w-3xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            {t("title")}
          </h2>
          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            {t("description")}
          </p>
        </div>
      </motion.div>

      {/* Cards */}
      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Cards.map((card, idx) => (
          <motion.div
            key={card.id}
            variants={itemFadeUp}
            initial="hidden"
            whileInView="show"
            transition={{ delay: idx * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex h-full flex-col justify-between rounded-xl border border-gray-300 bg-white p-6 text-start shadow-sm transition-shadow hover:shadow-md"
          >
            <div>
              <Image
                src={card.image}
                alt={t(card.titleKey)}
                className="mb-4 h-10 w-10"
              />
              <h3 className="text-TextPrimary text-lg font-semibold">
                {t(card.titleKey)}
              </h3>
              <p className="text-TextSecondary mt-2 text-sm font-normal">
                {t(card.descriptionKey)}
              </p>
            </div>
            <Link
              href={card.link}
              className="group text-primaryBlue mt-4 inline-flex w-fit items-center gap-2 text-sm font-medium"
            >
              <span className="relative inline-flex items-center gap-2">
                {t("cta")}
                <MoveRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />

                {/* underline */}
                <span className="bg-primaryBlue absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default AdventagesSection;
