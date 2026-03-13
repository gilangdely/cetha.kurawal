"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type CategoryKey = "cvReview" | "cvBuilder" | "improveLinkedin" | "careerTips";

const FAQ_CATEGORIES: Array<{
  key: CategoryKey;
  items: number[];
}> = [
  {
    key: "cvReview",
    items: [1, 2, 3, 4],
  },
  {
    key: "cvBuilder",
    items: [1, 2, 3, 4],
  },
  {
    key: "improveLinkedin",
    items: [1, 2, 3, 4],
  },
  {
    key: "careerTips",
    items: [1, 2, 3, 4],
  },
];

export default function FAQPage() {
  const t = useTranslations("FAQPage");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("cvReview");

  const selectedCategory =
    FAQ_CATEGORIES.find((c) => c.key === activeCategory) ?? FAQ_CATEGORIES[0];

  return (
    <section className="min-h-screen px-6 pt-20 pb-18 md:pt-32 md:pb-24">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-[300px_1fr]">
        {/* LEFT — Title + category pills */}
        <div className="space-y-6">
          <div>
            <h1 className="text-5xl leading-tight font-bold text-gray-900">
              {t("title")}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              {t("description")}
            </p>
          </div>

          {/* Category pills — wrapping flex like the reference */}
          <div className="flex flex-wrap gap-2">
            {FAQ_CATEGORIES.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.key
                    ? "bg-primaryBlue border-primaryBlueHover text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                }`}
              >
                {t(`categories.${category.key}.label`)}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Accordion + support */}
        <div className="space-y-0">
          <Accordion type="single" collapsible className="w-full">
            {selectedCategory.items.map((itemNumber) => (
              <AccordionItem
                key={itemNumber}
                value={`${selectedCategory.key}-item-${itemNumber}`}
                className="border-b border-gray-200 py-1"
              >
                <AccordionTrigger className="py-5 text-left text-lg font-medium text-gray-900 hover:no-underline">
                  {t(
                    `categories.${selectedCategory.key}.items.${itemNumber}.question`,
                  )}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-gray-500">
                  {t(
                    `categories.${selectedCategory.key}.items.${itemNumber}.answer`,
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
