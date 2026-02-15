"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PricingByQuota() {
  const t = useTranslations("pricingQuota");

  const QuotaList = [
    {
      tier: t("plans.beginner.tier"),
      price: t("plans.beginner.price"),
      quota: t("plans.beginner.quota"),
      tagline: t("plans.beginner.tagline"),
      features: t.raw("plans.beginner.features"),
      buttonText: t("plans.beginner.button"),
      featured: false,
    },
    {
      tier: t("plans.professional.tier"),
      price: t("plans.professional.price"),
      quota: t("plans.professional.quota"),
      tagline: t("plans.professional.tagline"),
      features: t.raw("plans.professional.features"),
      buttonText: t("plans.professional.button"),
      featured: false,
    },
    {
      tier: t("plans.exclusive.tier"),
      price: t("plans.exclusive.price"),
      quota: t("plans.exclusive.quota"),
      tagline: t("plans.exclusive.tagline"),
      features: t.raw("plans.exclusive.features"),
      buttonText: t("plans.exclusive.button"),
      featured: false,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto max-w-7xl px-4 py-16 pt-28"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8 text-center"
      >
        <div className="border-primaryBlue mx-auto w-fit rounded-full border-2 px-2 py-1 lg:px-3 lg:py-1.5">
          <p className="text-primaryBlue lg:font-medium">{t("badge")}</p>
        </div>
        <div className="mx-auto mt-4 max-w-3xl flex-col text-center">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-4xl lg:text-3xl">
            {t("title")}
          </h2>
          <p className="text-TextSecondary mt-2 text-base lg:text-lg">
            {t("description")}
          </p>
        </div>
      </motion.div>

      {/* Quota Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {QuotaList.map((plan, i) => (
          <motion.div
            key={plan.tier}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className={`relative flex h-full flex-col rounded-2xl border px-6 py-8 shadow-md transition-all duration-300 ${
              plan.featured
                ? "border-[#2563eb] bg-[#2563eb] text-white"
                : "border-slate-200 bg-white text-gray-800"
            }`}
          >
            {plan.featured && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold shadow"
              >
                Paling Populer
              </motion.div>
            )}
            <div className="mb-4">
              <h3 className="mb-1 text-xl font-bold">{plan.tier}</h3>
              <p className="text-sm opacity-90">{plan.tagline}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="text-sm opacity-80">• {plan.quota}</span>
              </div>
            </div>

            <ul className="mb-8 flex flex-1 flex-col gap-2 text-sm">
              {plan.features.map((f: string) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle
                    className={plan.featured ? "text-white" : "text-[#2563eb]"}
                    size={15}
                  />
                  <span
                    className={plan.featured ? "text-white" : "text-gray-700"}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full rounded-lg py-3 text-base font-medium transition-all duration-200 ${
                plan.featured
                  ? "bg-white text-[#2563eb] hover:bg-blue-50"
                  : "bg-[#2563eb] text-white hover:bg-blue-600"
              }`}
            >
              {plan.buttonText}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
