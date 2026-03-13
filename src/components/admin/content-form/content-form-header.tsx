"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ContentFormHeaderProps {
  isEdit: boolean;
  contentType: string;
  status: string;
  onToggleStatus: () => void;
}

export function ContentFormHeader({
  isEdit,
  contentType,
  status,
  onToggleStatus,
}: ContentFormHeaderProps) {
  const isPublished = status === "published";

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            {isEdit ? "Edit Konten" : "Buat Konten Baru"}
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              isPublished
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-emerald-500" : "bg-gray-400"}`}
            />
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">
          {contentType === "article" ? "Artikel Teks" : "Video YouTube"}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleStatus}
        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
          isPublished
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        }`}
      >
        {isPublished ? "Jadikan Draft" : "Set ke Published"}
      </button>
    </div>
  );
}
