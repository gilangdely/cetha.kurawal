"use client";

import CvReviewResult from "@/components/cv-review-result";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

import cardImg from "@/assets/img/article2.jpg";
import Link from "next/link";

export default function ResultPage() {
  const t = useTranslations("reviewCvResultPage");

  return (
    <main className="mx-auto flex w-full max-w-7xl items-start gap-6 px-6 pt-14 sm:px-6 md:pt-18 lg:gap-8 lg:px-8 lg:pt-22">
      {/* Left Aside — sticky sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="sticky top-24 mb-16 hidden w-64 flex-shrink-0 lg:block xl:w-72"
      >
        {/* Job Match CTA Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="relative h-36 w-full bg-gradient-to-br from-blue-50 to-blue-100">
            <Image
              src={cardImg}
              alt={t("aside.imageAlt")}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-TextPrimary mb-3 text-sm font-semibold">
              {t("aside.title")}
            </h3>
            <Link
              href={"/job-match"}
              className="bg-primaryBlue block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              {t("aside.button")}
            </Link>
          </div>
        </div>

        {/* Tips mini-card */}
        <div className="mt-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
          <p className="mb-1 text-xs font-semibold tracking-wide text-amber-600 uppercase">
            {t("tips.badge")}
          </p>
          <p className="text-xs leading-relaxed text-gray-600">
            {t("tips.description")}
          </p>
        </div>
      </motion.aside>

      {/* Main Content — fills all remaining space */}
      <section className="min-w-0 flex-1">
        <div className="w-full py-8 sm:py-12 lg:py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full"
          >
            <h2 className="text-center text-xl font-normal sm:text-2xl md:text-3xl lg:text-left lg:text-4xl">
              {t("title")}
            </h2>

            {/* Good & Need Improvement Sections */}
            <div className="my-8 space-y-8 sm:mt-8 sm:space-y-12">
              <CvReviewResult />
            </div>

            {/* Mobile-only CTA (hidden on lg+) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              className="mt-8 sm:mt-12 lg:hidden"
            >
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
                <div className="p-6 sm:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="bg-primaryBlue flex items-center justify-center rounded-full p-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10 5.25L9.484 6.794C8.808 8.888 8.47 9.936 7.768 10.638C7.066 11.34 6.018 11.678 3.922 12.354L2.378 12.87L3.922 13.386C6.018 14.062 7.066 14.4 7.768 15.102C8.47 15.804 8.808 16.852 9.484 18.946L10 20.49L10.516 18.946C11.192 16.852 11.53 15.804 12.232 15.102C12.934 14.4 13.982 14.062 16.078 13.386L17.622 12.87L16.078 12.354C13.982 11.678 12.934 11.34 12.232 10.638C11.53 9.936 11.192 8.888 10.516 6.794L10 5.25ZM18 3L17.7789 3.597C17.4889 4.381 17.344 4.773 17.0591 5.058C16.7742 5.343 16.3819 5.488 15.5973 5.778L15 6L15.598 6.221C16.3819 6.511 16.7742 6.656 17.0591 6.941C17.344 7.226 17.4889 7.619 17.7789 8.403L18 9L18.2211 8.403C18.5111 7.619 18.656 7.227 18.9409 6.942C19.2258 6.657 19.6181 6.512 20.4027 6.222L21 6L20.402 5.779C19.6181 5.489 19.2258 5.344 18.9409 5.059C18.656 4.774 18.5111 4.381 18.2211 3.597L18 3Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <h3 className="text-TextPrimary text-lg font-semibold sm:text-2xl">
                      {t("mobileCta.title")}
                    </h3>
                  </div>
                  <p className="mb-6 text-sm text-gray-600 sm:text-base">
                    {t("mobileCta.description")}
                  </p>
                  <button className="bg-primaryBlue w-full rounded-xl px-6 py-3.5 font-medium text-white shadow-md transition-all hover:bg-blue-600 hover:shadow-lg sm:text-lg">
                    {t("mobileCta.button")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
