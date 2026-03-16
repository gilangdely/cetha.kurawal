"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface ContentMainFieldsProps {
  title: string;
  excerpt: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function ContentMainFields({
  title,
  excerpt,
  onChange,
}: ContentMainFieldsProps) {
  const t = useTranslations("adminContents.form.mainFields");

  return (
    <div className="space-y-5">
      {/* Judul */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {t("title.label")} <span className="text-red-500">*</span>
        </label>
        <input
          required
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          placeholder={t("title.placeholder")}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />
      </div>

      {/* Excerpt */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">
          {t("excerpt.label")}{" "}
          <span className="text-xs font-normal text-gray-400">
            ({t("excerpt.hint")})
          </span>
        </label>
        <textarea
          name="excerpt"
          value={excerpt}
          onChange={onChange}
          rows={3}
          maxLength={250}
          placeholder={t("excerpt.placeholder")}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        />
        <div className="flex justify-end">
          <span
            className={`text-[11px] font-medium tabular-nums ${excerpt.length >= 240 ? "text-amber-500" : "text-gray-400"}`}
          >
            {t("excerpt.counter", { count: excerpt.length })}
          </span>
        </div>
      </div>
    </div>
  );
}
