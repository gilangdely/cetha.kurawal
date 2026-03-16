"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ContentFormHeader } from "@/components/admin/content-form/content-form-header";
import { ContentTypeSelector } from "@/components/admin/content-form/content-type-selector";
import { ContentMainFields } from "@/components/admin/content-form/content-main-fields";
import { ContentEditorSection } from "@/components/admin/content-form/content-editor-section";
import { ContentMetaSidebar } from "@/components/admin/content-form/content-meta-sidebar";
import { ContentSubmitCard } from "@/components/admin/content-form/content-submit-card";

interface ContentFormProps {
  id?: string;
  initialData?: any;
}

export function ContentForm({ id, initialData }: ContentFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("adminContents.form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    type: "article",
    title: "",
    slug: "",
    excerpt: "",
    contentHtml: "",
    youtubeUrl: "",
    coverImageUrl: "",
    tags: "",
    status: "draft",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || "article",
        title: initialData.title || "",
        slug: initialData.slug || "",
        excerpt: initialData.excerpt || "",
        contentHtml: initialData.contentHtml || "",
        youtubeUrl: initialData.youtubeUrl || "",
        coverImageUrl: initialData.coverImageUrl || "",
        tags: (initialData.tags || []).join(", "),
        status: initialData.status || "draft",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (html: string) => {
    setFormData((prev) => ({ ...prev, contentHtml: html }));
  };

  const handleToggleStatus = () => {
    setFormData((p) => ({
      ...p,
      status: p.status === "draft" ? "published" : "draft",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...formData,
        slug: formData.slug.trim() || undefined,
        contentHtml: formData.type === "video" ? null : formData.contentHtml,
        youtubeUrl: formData.type === "article" ? null : formData.youtubeUrl,
        coverImageUrl: formData.coverImageUrl.trim() || undefined,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      const url = id ? `/api/admin/contents/${id}` : `/api/admin/contents`;
      const method = id ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || json.ok === false || json.success === false) {
        throw new Error(json.message || json.error || t("errors.saveFailed"));
      }

      router.push(`/${locale}/admin/contents`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <ContentFormHeader
        isEdit={!!id}
        contentType={formData.type}
        status={formData.status}
        onToggleStatus={handleToggleStatus}
      />

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Body: two-column layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* Left — Main content */}
        <div className="space-y-5 lg:col-span-2">
          {/* Informasi Utama card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-gray-800">
              {t("sections.basicInfo")}
            </h3>
            <div className="space-y-5">
              <ContentTypeSelector
                value={formData.type}
                onChange={(type) => setFormData((p) => ({ ...p, type }))}
              />
              <ContentMainFields
                title={formData.title}
                excerpt={formData.excerpt}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Editor Section */}
          <ContentEditorSection
            contentType={formData.type}
            contentHtml={formData.contentHtml}
            youtubeUrl={formData.youtubeUrl}
            onEditorChange={handleEditorChange}
            onChange={handleChange}
          />
        </div>

        {/* Right — Sidebar */}
        <div className="space-y-4">
          <ContentMetaSidebar
            slug={formData.slug}
            coverImageUrl={formData.coverImageUrl}
            tags={formData.tags}
            onChange={handleChange}
          />
          <ContentSubmitCard loading={loading} error={error} isEdit={!!id} />
        </div>
      </div>
    </form>
  );
}
