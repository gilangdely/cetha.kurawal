"use client";

import UploadJobs from "@/components/upload-jobs";
import Image from "next/image";
import { useTranslations } from "next-intl";

import illustration from "@/assets/img/illustration-rekomendasi-pekerjaan.jpg";

export default function Home() {
  const t = useTranslations("jobMatchPage");

  return (
    <main className="mx-auto flex w-full max-w-7xl items-center pt-20 lg:pt-0">
      <section className="w-full">
        {/* Hero Section */}
        <div className="flex w-full items-center py-12 lg:min-h-screen lg:py-0">
          <div className="flex w-full items-center gap-10 px-6 lg:flex-row lg:px-0">
            <div className="w-full flex-1 lg:mt-24">
              <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
                {t("hero.titlePrefix")}{" "}
                <span className="text-accentOrange">
                  {t("hero.titleHighlight")}
                </span>{" "}
                {t("hero.titleSuffix")}
              </h2>
              <p className="text-TextSecondary mt-3 text-lg">
                {t("hero.description")}
              </p>
              <div>
                <UploadJobs />
              </div>
            </div>
            <div className="hidden flex-1 lg:block">
              <Image alt={t("hero.imageAlt")} src={illustration}></Image>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
