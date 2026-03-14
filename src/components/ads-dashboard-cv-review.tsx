import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

export default function AdsDashboardCvReview() {
  const t = useTranslations("DashboardAds");

  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-2.5">
        <div>
          <h2 className="text-TextPrimary text-2xl font-bold md:text-3xl">
            {t("title")}{" "}
            <span className="from-primaryBlue to-primaryBlueHover bg-gradient-to-r bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-TextSecondary text-xs leading-relaxed md:text-sm">
            {t("description")}
          </p>

          <ul className="text-TextSecondary mt-2 space-y-2 text-xs md:text-sm">
            {[
              t("features.info"),
              t("features.format"),
              t("features.experience"),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="bg-primaryBlue/15 text-primaryBlue flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-semibold">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={"/dashboard/cv-builder"}
          className="group from-primaryBlue to-primaryBlueHover mt-3 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
        >
          {t("cta")}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock UI */}
      <div className="hidden w-full max-w-2xs flex-1 md:flex md:flex-col">
        <div className="border-primaryBlue/10 relative flex-1 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-TextSecondary text-[10px] font-semibold tracking-widest uppercase">
              {t("mock.score")}
            </span>

            <span className="text-primaryBlue text-2xl font-bold tracking-tight">
              84
              <span className="text-TextSecondary text-sm font-semibold">
                /100
              </span>
            </span>
          </div>

          {[
            {
              label: t("mock.info"),
              score: 90,
              color: "bg-primaryBlue",
            },
            {
              label: t("mock.format"),
              score: 82,
              color: "bg-primaryBlueHover",
            },
            {
              label: t("mock.experience"),
              score: 76,
              color: "bg-accentOrange",
            },
          ].map((item) => (
            <div key={item.label} className="mb-3">
              <div className="text-TextSecondary mb-1 flex justify-between text-[11px]">
                <span>{item.label}</span>
                <span className="font-medium">{item.score}%</span>
              </div>

              <div className="bg-Background h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${item.color}`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}

          <div className="border-accentOrange/20 bg-accentOrange/10 mt-5 rounded-lg border p-2.5">
            <p className="text-accentOrange flex items-start gap-1.5 text-[10px] leading-relaxed">
              <Lightbulb size={12} className="mt-[1px] shrink-0" />
              {t("tip")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
