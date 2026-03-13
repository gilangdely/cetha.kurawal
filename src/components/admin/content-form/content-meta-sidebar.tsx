"use client";

import React from "react";
import { Hash, Image, Tag } from "lucide-react";

interface ContentMetaSidebarProps {
  slug: string;
  coverImageUrl: string;
  tags: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-3.5">
        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
          Metadata Publikasi
        </h3>
      </div>
      <div className="space-y-5 p-5">
        <MetaField label="URL Slug" hint="Kosongkan agar di-generate otomatis" icon={Hash}>
          <input
            type="text"
            name="slug"
            value={slug}
            onChange={onChange}
            placeholder="judul-konten-kamu"
            className={inputClass}
          />
        </MetaField>

        <MetaField label="Gambar Sampul" icon={Image}>
          <input
            type="url"
            name="coverImageUrl"
            value={coverImageUrl}
            onChange={onChange}
            placeholder="https://..."
            className={inputClass}
          />
          {coverImageUrl && (
            <div className="mt-2 overflow-hidden rounded-lg border border-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImageUrl}
                alt="Preview"
                className="h-28 w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </MetaField>

        <MetaField label="Tags" hint="Pisahkan dengan koma" icon={Tag}>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={onChange}
            placeholder="frontend, javascript, resume"
            className={inputClass}
          />
        </MetaField>
      </div>
    </div>
  );
}
