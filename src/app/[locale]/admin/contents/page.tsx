"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Edit,
  Trash2,
  Globe,
  EyeOff,
  FileText,
  Video,
  MoreHorizontal,
  Inbox,
} from "lucide-react";
import BentoGridStatsContentAdmin from "@/components/bento-grid-stats-content-admin";
import TypeFilterContentAdmin from "@/components/type-filter-content-admin";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video";
  status: "draft" | "published";
  createdAt: { _seconds: number };
}

export default function AdminContentsPage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

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
    if (!confirm("Yakin ingin menghapus konten ini secara permanen?")) return;
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
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(seconds * 1000));
  };

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Konten Tip Karier
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Kelola artikel dan video tutorial untuk platform.
          </p>
        </div>
        <Link
          href="/admin/contents/new-contents"
          className="bg-primaryBlue hover:bg-primaryBlueHover flex items-center gap-2 rounded-full px-4 py-2 text-white transition-all duration-200"
        >
          <PlusCircle size={16} />
          Konten Baru
        </Link>
      </div>

      {/* Stats */}
      <BentoGridStatsContentAdmin contents={contents} />

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
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-sm font-semibold text-gray-800">
              Daftar Konten
            </h2>
            <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-400">
              {filteredContents.length} konten
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70">
                  <th className="px-6 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Judul
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Tipe
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3.5 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Dibuat
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold tracking-wide text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <tr key={i}>
                        <td className="px-6 py-4">
                          <div className="h-4 w-48 animate-pulse rounded-lg bg-gray-200" />
                          <div className="mt-2 h-3 w-20 animate-pulse rounded-lg bg-gray-200" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-16 animate-pulse rounded-lg bg-gray-200" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-6 w-20 animate-pulse rounded-full bg-gray-200" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-4 w-24 animate-pulse rounded-lg bg-gray-200" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
                        </td>
                      </tr>
                    ))
                ) : filteredContents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="rounded-2xl bg-gray-100 p-4">
                          <Inbox className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="font-semibold text-gray-700">
                          Belum ada konten
                        </p>
                        <p className="text-sm text-gray-400">
                          Buat artikel atau video pertama kamu
                        </p>
                        <Link href="/id/admin/contents/new">
                          <button className="mt-1 flex items-center gap-2 rounded-xl bg-gradient-to-br from-[#3B5BDB] to-[#4C6EF5] px-4 py-2 text-sm font-semibold text-white transition-all hover:from-[#2F4AC2] hover:to-[#3B5BDB] hover:shadow-[0_4px_15px_rgba(59,91,219,0.35)]">
                            <PlusCircle size={15} />
                            Buat Konten
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredContents.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition-colors duration-150 hover:bg-[#F0F4FF]"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm leading-snug font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-gray-400">
                          #{item.id.slice(0, 8)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        {item.type === "article" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                            <FileText size={12} />
                            Artikel
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                            <Video size={12} />
                            Video
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            item.status === "published"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${item.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`}
                          />
                          {item.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(item.createdAt?._seconds)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenMenu(openMenu === item.id ? null : item.id)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-gray-100"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === item.id && (
                            <div className="absolute top-9 right-0 z-20 w-48 animate-[fadeIn_0.15s_ease] overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg">
                              <button
                                onClick={() => {
                                  togglePublish(item.id, item.status);
                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                              >
                                {item.status === "published" ? (
                                  <>
                                    <EyeOff
                                      size={14}
                                      className="text-gray-500"
                                    />
                                    <span>Tarik ke Draft</span>
                                  </>
                                ) : (
                                  <>
                                    <Globe
                                      size={14}
                                      className="text-blue-500"
                                    />
                                    <span>Publikasikan</span>
                                  </>
                                )}
                              </button>
                              <Link href={`/id/admin/contents/${item.id}/edit`}>
                                <button className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                                  <Edit size={14} className="text-gray-500" />
                                  <span>Edit Konten</span>
                                </button>
                              </Link>
                              <div className="my-1 border-t border-gray-100" />
                              <button
                                onClick={() => {
                                  deleteContent(item.id);
                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                                <span>Hapus Permanen</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                <p className="font-semibold text-gray-700">Belum ada konten</p>
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
                        Artikel
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                        <Video size={11} />
                        Video
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
                      {item.status === "published" ? "Live" : "Draft"}
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
                      <Link href={`/id/admin/contents/${item.id}/edit`}>
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

      {/* Click outside to close menu */}
      {openMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setOpenMenu(null)} />
      )}
    </div>
  );
}
