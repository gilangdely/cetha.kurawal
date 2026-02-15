"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function LangSwitchMobile() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);

  const languages = [
    { code: "id", label: "Indonesia", flag: "🇮🇩" },
    { code: "en", label: "English", flag: "🇺🇸" },
  ] as const;

  const activeLanguage = languages.find((l) => l.code === locale)!;

  const switchLanguage = (nextLocale: "id" | "en") => {
    if (nextLocale === locale) return;

    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-full bg-white px-4 py-2.5 font-medium text-gray-700 border shadow-sm transition hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
      >
        <div className="flex items-center gap-2">
          <Globe size={18} />
          <span>{activeLanguage.code.toUpperCase()}</span>
        </div>

        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-2 ml-4 flex flex-col border-l border-gray-200 pl-4 dark:border-gray-700"
          >
            {languages.map((lang) => {
              const isActive = lang.code === locale;

              return (
                <button
                  key={lang.code}
                  disabled={isActive}
                  onClick={() => switchLanguage(lang.code)}
                  className={`flex items-center justify-between rounded-lg px-2 py-2 text-sm transition ${
                    isActive
                      ? "text-primaryBlue cursor-default"
                      : "hover:text-primaryBlue text-gray-600 dark:text-gray-300"
                  } `}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                  </span>

                  {isActive && <Check size={16} className="text-primaryBlue" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
