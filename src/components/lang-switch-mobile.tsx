"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
    <div className="relative mt-2">
      {/* Button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-gray-50"
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-gray-500" />
          <span className="font-medium">
            {activeLanguage.code.toUpperCase()}
          </span>
        </div>

        {open ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            {languages.map((lang) => {
              const isActive = lang.code === locale;

              return (
                <button
                  key={lang.code}
                  disabled={isActive}
                  onClick={() => switchLanguage(lang.code)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition ${
                    isActive
                      ? "text-primaryBlue cursor-default bg-gray-50"
                      : "hover:text-primaryBlue text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
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
