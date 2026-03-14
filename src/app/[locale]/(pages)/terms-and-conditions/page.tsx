import Link from "next/link";
import { getTranslations } from "next-intl/server";

const SECTION_NUMBERS = ["01", "02", "03", "04", "05", "06", "07", "08"];

export default async function SyaratKetentuanPage() {
  const t = await getTranslations();

  return (
    <section className="min-h-screen bg-gray-50 px-4 pt-28 pb-20 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Hero */}
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">
            {t("TermsPage.title")}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-gray-500">
            {t("TermsPage.description")}
          </p>
          <p className="text-sm text-gray-400">{t("TermsPage.lastRevision")}</p>
        </div>

        {/* Sections card */}
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {SECTION_NUMBERS.map((num) => (
            <div
              key={num}
              className="grid grid-cols-[40px_1fr] gap-4 px-6 py-5"
            >
              <span className="pt-0.5 text-sm font-medium text-gray-400">
                {num}
              </span>
              <div>
                <h2 className="mb-1 text-[15px] font-semibold text-gray-900">
                  {t(`TermsPage.sections.${num}.title`)}
                </h2>
                <p className="text-sm leading-relaxed text-gray-500">
                  {t(`TermsPage.sections.${num}.content`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-4 rounded-2xl bg-gray-100 p-5">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="8"
                cy="8"
                r="6.5"
                stroke="#2563eb"
                strokeWidth="1.2"
              />
              <line
                x1="8"
                y1="6"
                x2="8"
                y2="11"
                stroke="#2563eb"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="8" cy="4.5" r="0.75" fill="#2563eb" />
            </svg>
          </div>
          <p className="text-sm leading-relaxed text-gray-500">
            <span className="font-medium text-gray-800">
              {t("TermsPage.support.title")}
            </span>{" "}
            {t("TermsPage.support.description")}{" "}
            <Link
              href="/about-us#contact-us"
              className="text-primaryBlue font-medium hover:underline"
            >
              {t("TermsPage.support.cta")}
            </Link>{" "}
            {t("TermsPage.support.suffix")}
          </p>
        </div>
      </div>
    </section>
  );
}
