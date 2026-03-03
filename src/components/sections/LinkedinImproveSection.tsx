"use client";

import Image from "next/image";
import LinkedinIllustration from "@/assets/img/linkedin-illustration.png";
import { MoveRight, SquareMousePointer } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const LinkedinImproveSection = () => {
  const t = useTranslations("LinkedinImproveSection");

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <div className="flex flex-col items-center gap-10 md:flex-row md:items-center">
        {/* LEFT */}
        <div className="flex-1 md:flex-[0.6]">
          <div className="flex flex-col items-start text-left">
            <div className="border-primaryBlue/40 bg-primaryBlue/5 w-fit rounded-full border px-3 py-1">
              <p className="text-primaryBlue text-sm font-medium tracking-wide">
                {t("badge")}
              </p>
            </div>

            <div className="mt-4 max-w-xl">
              <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
                {t("title")}
              </h2>
              <p className="text-TextSecondary mt-2 max-w-lg text-base md:text-lg">
                {t("description")}
              </p>
            </div>

            <div className="mt-6">
              <Link
                href="/tingkatkan-linkedIn"
                className="group bg-primaryBlue hover:bg-primaryBlueHover shadow-primaryBlue/30 hover:shadow-primaryBlue/25 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
              >
                <span>{t("cta")}</span>
                <MoveRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 md:flex-[0.8]">
          <div className="relative mx-auto max-w-md md:max-w-lg">
            <Image
              alt="Linkedin Illustration"
              src={LinkedinIllustration}
              className="h-auto w-full rounded-2xl object-contain shadow-[0_20px_50px_rgba(0,0,0,0.10)]"
            />

            {/* Floating Tooltip Card */}
            <div className="border-primaryBlue/30 bg-primaryBlue/10 absolute bottom-[-40px] max-w-sm rounded-2xl border p-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-md md:left-[-40px]">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center">
                  <SquareMousePointer className="text-primaryBlue h-6 w-6" />
                </div>

                <div>
                  <p className="text-primaryBlue text-sm font-semibold">
                    {t("tooltip.title")}
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-gray-800">
                    {t("tooltip.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LinkedinImproveSection;
