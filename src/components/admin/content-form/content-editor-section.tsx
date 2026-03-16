"use client";

import { Video, LayoutTemplate } from "lucide-react";
import RichTextEditor from "@/components/admin/rich-text-editor";
import React from "react";
import { useTranslations } from "next-intl";

interface ContentEditorSectionProps {
  contentType: string;
  contentHtml: string;
  youtubeUrl: string;
  onEditorChange: (html: string) => void;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

export function ContentEditorSection({
  contentType,
  contentHtml,
  youtubeUrl,
  onEditorChange,
  onChange,
}: ContentEditorSectionProps) {
  const t = useTranslations("adminContents.form.editorSection");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Card Header */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3.5">
        <LayoutTemplate size={15} className="text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-800">
          {contentType === "article" ? t("title.article") : t("title.video")}
        </h3>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {contentType === "article" ? (
          <div className="overflow-hidden rounded-xl border border-gray-200 transition-shadow focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-500/20">
            <RichTextEditor content={contentHtml} onChange={onEditorChange} />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {t("youtube.label")} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Video className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="url"
                name="youtubeUrl"
                value={youtubeUrl}
                onChange={onChange}
                placeholder={t("youtube.placeholder")}
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-red-400 focus:ring-2 focus:ring-red-400/20 focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-400">{t("youtube.hint")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
