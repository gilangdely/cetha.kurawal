"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  PlusCircle,
  Edit,
  Trash2,
  Globe,
  EyeOff,
  FileText,
  Video,
  Inbox,
} from "lucide-react";
import ContentStatsContentAdmin from "@/components/content-stats-content-admin";
import TypeFilterContentAdmin from "@/components/type-filter-content-admin";
import TableContentsAdmin from "@/components/table-contents-admin";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video";
  status: "draft" | "published";
  createdAt: { _seconds: number };
}

export default function AdminContentsPage() {
  const t = useTranslations("adminContents.page");
  const locale = useLocale();
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const loadContents = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/contents", window.location.origin);
      if (typeFilter !== "all") url.searchParams.append("type", typeFilter);
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setContents(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [typeFilter]);

  const togglePublish = async (id: string, currentStatus: string) => {
    const action = currentStatus === "published" ? "unpublish" : "publish";
    try {
      await fetch(`/api/admin/contents/${id}/${action}`, { method: "POST" });
      loadContents();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteContent = async (id: string) => {
    if (!confirm(t("deleteConfirm"))) return;
    try {
      await fetch(`/api/admin/contents/${id}`, { method: "DELETE" });
      loadContents();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredContents = contents.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  const formatDate = (seconds?: number) => {
    if (!seconds) return "-";
    const localeTag = locale === "id" ? "id-ID" : "en-US";
    return new Intl.DateTimeFormat(localeTag, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(seconds * 1000));
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {t("title")}
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            {t("description")}
          </p>
        </div>
        <Link
          href="/admin/contents/create-new-contents"
          className="bg-primaryBlue hover:bg-primaryBlueHover flex items-center gap-2 rounded-full px-4 py-2 text-white transition-all duration-200"
        >
          <PlusCircle size={16} />
          {t("newContent")}
        </Link>
      </div>

      {/* Stats */}
      <ContentStatsContentAdmin contents={contents} />

      {/* Filter & Search Bar */}
      <TypeFilterContentAdmin
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        filteredCount={filteredContents.length}
      />

      {/* Content: Table View */}
      {viewMode === "table" && (
        <TableContentsAdmin
          contents={filteredContents}
          loading={loading}
          formatDate={formatDate}
          togglePublish={togglePublish}
          deleteContent={deleteContent}
        />
      )}

      {/* Content: Grid View */}
      {viewMode === "grid" && (
        <div>
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-gray-100 bg-white p-5"
                  >
                    <div className="mb-4 h-4 w-16 animate-pulse rounded-full bg-gray-200" />
                    <div className="mb-2 h-5 w-full animate-pulse rounded-lg bg-gray-200" />
                    <div className="mb-4 h-5 w-3/4 animate-pulse rounded-lg bg-gray-200" />
                    <div className="h-3 w-24 animate-pulse rounded-lg bg-gray-200" />
                  </div>
                ))}
            </div>
          ) : filteredContents.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-2xl bg-gray-100 p-4">
                  <Inbox className="h-8 w-8 text-gray-400" />
                </div>
                <p className="font-semibold text-gray-700">{t("grid.emptyTitle")}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContents.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-3 flex items-start justify-between">
                    {item.type === "article" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                        <FileText size={11} />
                        {t("types.article")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <Video size={11} />
                        {t("types.video")}
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        item.status === "published"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${item.status === "published" ? "bg-emerald-500" : "bg-amber-400"}`}
                      />
                      {item.status === "published"
                        ? t("status.live")
                        : t("status.draft")}
                    </span>
                  </div>
                  <h3 className="mb-3 line-clamp-2 text-sm leading-snug font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                    <span className="text-xs text-gray-400">
                      {formatDate(item.createdAt?._seconds)}
                    </span>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => togglePublish(item.id, item.status)}
                        className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                      >
                        {item.status === "published" ? (
                          <EyeOff size={13} />
                        ) : (
                          <Globe size={13} />
                        )}
                      </button>
                      <Link href={`/admin/contents/${item.id}/edit`}>
                        <button className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100">
                          <Edit size={13} />
                        </button>
                      </Link>
                      <button
                        onClick={() => deleteContent(item.id)}
                        className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
