import React from "react";
import { Check, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function AdsDashboardImproveLinkedin() {
  const t = useTranslations("DashboardAds3");
  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-2.5">
        <div>
          <h2 className="text-TextPrimary text-2xl font-bold md:text-3xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h2>

          <p className="text-TextSecondary text-xs leading-relaxed md:text-sm">
            {t("description")}
          </p>

          <ul className="text-TextSecondary mt-2.5 space-y-2 text-xs md:text-sm">
            {[
              t("features.headline"),
              t("features.keywords"),
              t("features.analysis"),
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-semibold text-blue-500">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={"/dashboard/linkedin-optimizer"}
          className="group mt-6 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300"
        >
          {t("cta")}
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock Profile Card */}
      <div className="hidden w-full max-w-2xs flex-1 md:flex md:flex-col">
        <div className="border-primaryBlue/10 relative flex-1 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-sm">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-TextPrimary truncate text-xs font-bold">
                Alex Smith
              </p>
              <p className="truncate text-[10px] font-medium text-blue-500">
                Product Designer
              </p>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-TextSecondary font-medium">
                {t("mock.profileStrength")}
              </span>
              <span className="font-bold text-blue-500">All-Star ⭐</span>
            </div>
            <div className="bg-Background h-1.5 w-full overflow-hidden rounded-full">
              <div className="h-1.5 w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-blue-500/10 bg-blue-50 p-2 text-center">
              <p className="text-sm font-bold text-blue-500">2.4k</p>
              <p className="text-TextSecondary text-[9px] leading-tight">
                {t("mock.views")}
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-blue-50 p-2 text-center">
              <p className="text-sm font-bold text-blue-500">138</p>
              <p className="text-TextSecondary text-[9px] leading-tight">
                {t("mock.search")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
            <TrendingUp size={12} className="text-blue-500" />
            <span className="text-TextSecondary text-[10px] font-medium">
              {t("mock.visibility")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
