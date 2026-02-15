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

  /* Close on outside click */
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
        aria-haspopup="listbox"
        aria-expanded={open}
        className="group flex items-center gap-1.5 rounded-full border border-transparent bg-transparent px-3 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-white hover:shadow-sm data-[scrolled=true]:border-gray-300 data-[scrolled=true]:bg-white data-[scrolled=true]:shadow-sm dark:text-gray-200 dark:hover:bg-gray-800 dark:data-[scrolled=true]:bg-gray-800"
      >
        <Globe
          size={16}
          className="group-hover:text-primaryBlue text-gray-600 transition-colors dark:text-gray-300"
        />

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
        className={`absolute right-0 z-50 mt-3 w-48 origin-top-right transition-all duration-200 ${
          open
            ? "scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="overflow-hidden rounded-xl border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <ul role="listbox" className="p-1">
            {languages.map((lang) => {
              const isActive = lang.code === locale;

              return (
                <li key={lang.code}>
                  <button
                    role="option"
                    aria-selected={isActive}
                    disabled={isActive}
                    onClick={() => switchLanguage(lang.code)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "cursor-default bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50"
                    } `}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="font-medium">{lang.label}</span>
                    </span>

                    {isActive && (
                      <Check
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
