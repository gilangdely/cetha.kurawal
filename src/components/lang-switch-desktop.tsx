"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check, Globe } from "lucide-react";

export default function LangSwitchDesktop() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  /* Close when click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex h-12 items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
      >
        <Globe size={16} className="text-gray-600" />

        <span>{activeLanguage.code.toUpperCase()}</span>

        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 z-50 mt-2 w-48 origin-top-right transition-all duration-200 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          {languages.map((lang) => {
            const isActive = lang.code === locale;

            return (
              <button
                key={lang.code}
                disabled={isActive}
                onClick={() => switchLanguage(lang.code)}
                className={`flex items-center justify-between px-4 py-2 text-sm transition ${
                  isActive
                    ? "cursor-default bg-gray-50 text-gray-900"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </span>

                {isActive && <Check size={16} className="text-primaryBlue" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
