"use client";

import { FileText, Video } from "lucide-react";

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

export function ContentTypeSelector({ value, onChange }: ContentTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Format Konten</label>
      <div className="grid grid-cols-2 gap-3">
        {TYPES.map((t) => {
          const isActive = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-5 transition-all ${
                isActive
                  ? t.activeClass + " shadow-sm"
                  : "border-gray-100 bg-white text-gray-400 hover:border-gray-200 hover:text-gray-600"
              }`}
            >
              {isActive && (
                <span className={`absolute top-2.5 right-2.5 h-2 w-2 rounded-full ${t.dotClass}`} />
              )}
              <t.icon size={22} strokeWidth={1.75} />
              <span className="text-sm font-semibold">{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
