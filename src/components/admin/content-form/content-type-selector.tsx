"use client";

import { FileText, Video } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContentTypeSelectorProps {
  value: string;
  onChange: (type: "article" | "video") => void;
}

const TYPES = [
  {
    key: "article" as const,
    label: "Teks Artikel",
    icon: FileText,
    activeClass: "border-blue-500 bg-blue-50 text-blue-600",
    dotClass: "bg-blue-500",
  },
  {
    key: "video" as const,
    label: "Video YouTube",
    icon: Video,
    activeClass: "border-red-400 bg-red-50 text-red-600",
    dotClass: "bg-red-400",
  },
];

export function ContentTypeSelector({
  value,
  onChange,
}: ContentTypeSelectorProps) {
  const t = useTranslations("adminContents.form.typeSelector");

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{t("label")}</label>
      <div className="grid grid-cols-2 gap-3">
        {TYPES.map((typeOption) => {
          const isActive = value === typeOption.key;
          const label =
            typeOption.key === "article"
              ? t("options.article")
              : t("options.video");

          return (
            <button
              key={typeOption.key}
              type="button"
              onClick={() => onChange(typeOption.key)}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all ${
                isActive
                  ? typeOption.activeClass + " shadow-sm"
                  : "border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <span
                  className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full ${typeOption.dotClass}`}
                />
              )}
              <typeOption.icon size={22} strokeWidth={1.75} />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
