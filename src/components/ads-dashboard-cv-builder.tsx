import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function AdsDashboardCvBuilder() {
  const t = useTranslations("DashboardAds2");

  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>{" "}
            {t("titleSuffix")}
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-gray-600 md:text-base">
            {t("description")}
          </p>

          <div className="mt-2 mb-3 flex flex-wrap gap-3">
            {[t("tags.templates"), t("tags.ai"), t("tags.pdf")].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-violet-300/50 bg-violet-100/30 px-3 py-1 text-xs font-medium text-violet-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={"/dashboard/cv-builder"}
          className="group mt-3 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
        >
          {t("cta")}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock Template Picker */}
      <div className="hidden w-full max-w-xs flex-1 md:flex md:flex-col">
        <div className="border-primaryBlue/10 relative flex-1 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          {/* subtle glow */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-violet-100/40 blur-2xl" />

          <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
            {t("mock.chooseTemplate")}
          </p>

          <div className="mb-4 grid grid-cols-2 gap-2">
            {[
              t("mock.templates.modern"),
              t("mock.templates.classic"),
              t("mock.templates.creative"),
              t("mock.templates.bold"),
            ].map((t, i) => (
              <div
                key={t}
                className={`cursor-pointer rounded-lg border p-2 text-center text-xs transition-all duration-200 ${
                  i === 0
                    ? "border-violet-400 bg-violet-200/40 text-violet-700 shadow-sm shadow-violet-200"
                    : "border-gray-200/50 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-xl border border-gray-200/50 bg-gray-50/50 p-3">
            <div className="h-2 w-24 rounded bg-violet-300/50" />
            <div className="h-1.5 w-full rounded bg-gray-200/50" />
            <div className="h-1.5 w-3/4 rounded bg-gray-200/50" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
