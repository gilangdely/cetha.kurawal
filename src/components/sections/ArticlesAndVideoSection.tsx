import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

const ArticlesAndVideoSection = () => {
  const articles = [
    {
      date: "10 Jan 2026",
      title: "Cara Membuat CV yang Menarik",
      description:
        "Pelajari struktur, pemilihan kata, dan strategi penulisan CV agar lebih profesional dan menarik perhatian recruiter.",
    },
    {
      date: "12 Jan 2026",
      title: "Strategi Lolos Screening ATS",
      description:
        "Pahami cara kerja Applicant Tracking System dan optimalkan CV Anda agar lolos seleksi otomatis.",
    },
    {
      date: "15 Jan 2026",
      title: "Tips Personal Branding di LinkedIn",
      description:
        "Bangun profil LinkedIn yang kuat untuk meningkatkan visibilitas dan peluang karier Anda.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="border-primaryBlue/40 bg-primaryBlue/5 mx-auto w-fit rounded-full border px-3 py-1">
          <p className="text-primaryBlue text-sm font-medium tracking-wide">
            Artikel & Video
          </p>
        </div>
        <div className="mt-4 max-w-2xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            Belajar Lebih Cerdas. Dapatkan Pekerjaan Lebih Cepat.
          </h2>

          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            Temukan panduan praktis dan video strategi karier untuk meningkatkan
            kualitas CV dan memperbesar peluang Anda diterima kerja.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-8">
        {/* Video */}
        <div className="w-full md:flex-1">
          <div className="p-1">
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-300 shadow-sm">
              {/* <img src="" className="h-full w-full object-cover" /> */}
            </div>

            {/* Meta */}
            <div className="mt-4">
              <p className="text-xs font-medium text-neutral-500">
                02 Aug · 3 min
              </p>

              <h3 className="mt-2 text-lg leading-snug font-semibold text-neutral-900">
                How to Cross the Atlantic Ocean While Working Full-Time: Luz
                Coloste's Story
              </h3>
            </div>
          </div>
        </div>

        {/* Divider Mobile Only */}
        <div className="block h-px w-full bg-neutral-200 md:hidden" />

        {/* Artikel */}
        <div className="w-full md:flex-1">
          <div className="space-y-2 md:space-y-4">
            {articles.map((article, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-2xl bg-white p-4 transition hover:shadow-sm md:flex-row md:p-2"
              >
                <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-xl bg-gray-300 md:h-32 md:w-48">
                  {/* <img className="h-full w-full object-cover" /> */}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      {article.date}
                    </p>

                    <h3 className="mt-1 text-lg leading-snug font-semibold text-neutral-900">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                      {article.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Divider */}
          <hr className="my-6 hidden border-neutral-200 md:block" />

          <div className="mt-4">
            <Link
              href="/tips-karir"
              className="group border-primaryBlue bg-primaryBlue hover:bg-primaryBlueHover inline-flex w-full items-center justify-between rounded-xl border px-6 py-4 text-white transition-all duration-300 hover:shadow-md"
            >
              <span className="text-base font-semibold tracking-tight">
                Lihat Semua Artikel
              </span>

              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticlesAndVideoSection;
