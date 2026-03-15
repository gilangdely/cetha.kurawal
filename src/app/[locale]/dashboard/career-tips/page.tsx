"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Book,
  Video,
  MoveDown,
  ArrowRight,
  PlayCircle,
  LayoutGrid,
  Search,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ContentItem {
  id: string;
  type: "article" | "video";
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  youtubeUrl: string | null;
}

export default function TipsKarirDashboard() {
  const t = useTranslations("careerTipsPage");
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");

  // Tab filtering (all, article, video)
  const [activeTab, setActiveTab] = useState<"all" | "article" | "video">(
    "all",
  );

  const [visibleCount, setVisibleCount] = useState(4);
  const initialVisible = 4;

  useEffect(() => {
    setVisibleCount(initialVisible);
  }, [search, activeTab]);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // Fetch only published content
        const res = await fetch("/api/contents");
        const json = await res.json();

        if (res.ok && json.success !== false) {
          setContents(json.data || []);
        } else {
          setErrorMsg(json.error || "Gagal memuat konten dari server");
        }
      } catch (e: any) {
        console.error("Failed to load contents", e);
        setErrorMsg(e.message || "Error jaringan gagal memuat");
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  const filteredContents = contents.filter((c) => {
    const matchTab = activeTab === "all" ? true : c.type === activeTab;

    const matchSearch =
      search.trim() === ""
        ? true
        : c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.excerpt.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  const visibleContents = filteredContents.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filteredContents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleTabChange = (tab: "all" | "article" | "video") => {
    setActiveTab(tab);
    setVisibleCount(initialVisible);
  };

  return (
    <main className="mx-auto flex w-full items-center">
      <section className="space-y-7">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl space-y-4">
            <h1 className="text-TextPrimary text-2xl font-semibold md:text-3xl lg:text-4xl">
              {t("hero.title")}
            </h1>

            <p className="text-TextSecondary mt-3 text-base sm:text-lg">
              {t("hero.description")}
            </p>
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm">
              <Search size={24} className="ml-3 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(initialVisible);
                }}
                placeholder={t("search.placeholder")}
                className="w-full bg-transparent p-2 text-sm outline-none"
              />

              <button
                type="button"
                className="bg-primaryBlue hover:bg-primaryBlueHover rounded-full px-5 py-2 text-sm font-medium text-white"
              >
                {t("search.button")}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="border-b border-gray-200">
          <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => handleTabChange("all")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                activeTab === "all"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <LayoutGrid size={16} /> {t("tabs.all")}
            </button>

            <button
              onClick={() => handleTabChange("article")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                activeTab === "article"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <Book size={16} /> {t("tabs.article")}
            </button>

            <button
              onClick={() => handleTabChange("video")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${
                activeTab === "video"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <Video size={16} /> {t("tabs.video")}
            </button>
          </div>
        </div>

        {errorMsg ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 py-20 text-center text-red-600">
            <div className="mb-2 text-xl font-bold">{t("error.title")}</div>
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
            <p className="text-lg font-medium">
              {search ? t("empty.notFound") : t("empty.noContent")}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${activeTab}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {visibleContents.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    {(() => {
                      // Resolve thumbnail: coverImageUrl > YouTube auto-thumbnail > icon fallback
                      const ytThumb =
                        item.type === "video" && item.youtubeUrl
                          ? (() => {
                              const m = item.youtubeUrl!.match(
                                /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*)/,
                              );
                              return m && m[1]?.length === 11
                                ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
                                : null;
                            })()
                          : null;

                      const thumbUrl = item.coverImageUrl || ytThumb;

                      if (thumbUrl) {
                        return (
                          <Image
                            src={thumbUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                            unoptimized
                          />
                        );
                      }

                      return (
                        <div className="flex h-full items-center justify-center text-gray-300">
                          {item.type === "video" ? (
                            <Video size={64} />
                          ) : (
                            <Book size={64} />
                          )}
                        </div>
                      );
                    })()}

                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30">
                        <PlayCircle
                          size={56}
                          className="text-white opacity-90 drop-shadow-md"
                        />
                      </div>
                    )}

                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition group-hover:bg-black/30">
                        <PlayCircle
                          size={54}
                          className="text-white opacity-90"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <span
                      className={`mb-3 w-fit rounded-full px-3 py-1 text-xs font-semibold ${item.type === "article" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.type === "article"
                        ? t("tabs.article")
                        : t("tabs.video")}
                    </span>

                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold">
                      {item.title}
                    </h3>

                    <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-600">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/dashboard/career-tips/${item.slug}`}
                      className="text-primaryBlue inline-flex items-center text-sm font-medium hover:underline"
                    >
                      {item.type === "article"
                        ? t("content.readArticle")
                        : t("content.watchVideo")}
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {!isAllVisible && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-primaryBlue inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white"
                >
                  <MoveDown size={16} /> {t("loadMore")}
                </button>
              </div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}
