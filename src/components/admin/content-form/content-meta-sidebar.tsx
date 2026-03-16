"use client";

import React from "react";
import { Hash, Image, Tag } from "lucide-react";
import { useTranslations } from "next-intl";

interface ContentMetaSidebarProps {
  slug: string;
  coverImageUrl: string;
  tags: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

interface MetaFieldProps {
  label: string;
  hint?: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

function MetaField({ label, hint, icon: Icon, children }: MetaFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-gray-400" />
        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
          {label}
        </label>
      </div>
      {children}
      {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm text-gray-800 placeholder-gray-400 transition-all focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none";

export function ContentMetaSidebar({
  slug,
  coverImageUrl,
  tags,
  onChange,
}: ContentMetaSidebarProps) {
  const t = useTranslations("adminContents.form.metaSidebar");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3.5">
        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          {t("title")}
        </h3>
      </div>
      <div className="space-y-5 p-5">
        <MetaField
          label={t("fields.slug.label")}
          hint={t("fields.slug.hint")}
          icon={Hash}
        >
          <input
            type="text"
            name="slug"
            value={slug}
            onChange={onChange}
            placeholder={t("fields.slug.placeholder")}
            className={inputClass}
          />
        </MetaField>

        <MetaField label={t("fields.coverImage.label")} icon={Image}>
          <input
            type="url"
            name="coverImageUrl"
            value={coverImageUrl}
            onChange={onChange}
            placeholder={t("fields.coverImage.placeholder")}
            className={inputClass}
          />
          {coverImageUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt={t("fields.coverImage.previewAlt")}
                className="h-28 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </MetaField>

        <MetaField
          label={t("fields.tags.label")}
          hint={t("fields.tags.hint")}
          icon={Tag}
        >
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={onChange}
            placeholder={t("fields.tags.placeholder")}
            className={inputClass}
          />
        </MetaField>
      </div>
    </div>
  );
}
