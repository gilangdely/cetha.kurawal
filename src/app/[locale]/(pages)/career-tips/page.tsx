"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CareerTipsSkeleton } from "@/components/career-tips-skeleton";
import {
  LayoutGrid,
  Book,
  Video,
  ArrowRight,
  MoveDown,
  PlayCircle,
  Search,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: "article" | "video";
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  youtubeUrl: string | null;
  tags?: string[];
}

export default function TipsKarirPage() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "id";

  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "article" | "video">(
    "all",
  );
  const [visibleCount, setVisibleCount] = useState(6);
  const initialVisible = 6;

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch("/api/contents");
        const json = await res.json();

        if (res.ok && json.success !== false) {
          setContents((json.data || []) as ContentItem[]);
        } else {
          setErrorMsg(json.error || "Gagal memuat konten dari server");
        }
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : "Error jaringan gagal memuat";
        setErrorMsg(message);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  const filteredContents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return contents.filter((item) => {
      const matchTab = activeTab === "all" ? true : item.type === activeTab;

      const matchSearch =
        normalizedSearch === ""
          ? true
          : item.title.toLowerCase().includes(normalizedSearch) ||
            item.excerpt.toLowerCase().includes(normalizedSearch) ||
            (item.tags || []).some((tag) =>
              tag.toLowerCase().includes(normalizedSearch),
            );

      return matchTab && matchSearch;
    });
  }, [activeTab, contents, search]);

  const visibleContents = filteredContents.slice(0, visibleCount);
  const isAllVisible = visibleCount >= filteredContents.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleTabChange = (tab: "all" | "article" | "video") => {
    setActiveTab(tab);
    setVisibleCount(initialVisible);
  };

  return (
    <main className="mx-auto flex w-full max-w-7xl items-center px-4 py-16 pt-18 pb-14 md:px-6 lg:min-h-screen lg:pt-28">
      <section className="space-y-7">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl space-y-4">
            <h1 className="text-TextPrimary text-2xl leading-tight font-semibold md:text-3xl lg:text-4xl">
              We build projects that help you meet your goals
            </h1>
            <p className="text-TextSecondary mt-3 text-base sm:text-lg">
              Jelajahi kumpulan artikel dan video untuk bantu kamu siap hadapi
              dunia kerja.
            </p>
          </div>

          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm"
            >
              <Search size={24} className="ml-3 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(initialVisible);
                }}
                placeholder="Search the case"
                className="w-full bg-transparent p-2 text-sm outline-none"
              />
              <button
                type="button"
                className="bg-primaryBlue hover:bg-primaryBlueHover rounded-full px-5 py-2 text-sm font-medium text-white transition-all duration-200"
              >
                Search
              </button>
            </motion.div>
          </div>
        </motion.div>

        <div className="border-b border-gray-200">
          <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => handleTabChange("all")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === "all"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <LayoutGrid size={16} /> All
            </button>

            <button
              onClick={() => handleTabChange("article")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === "article"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <Book size={16} /> Artikel
            </button>

            <button
              onClick={() => handleTabChange("video")}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === "video"
                  ? "bg-primaryBlue text-white"
                  : "text-TextSecondary hover:bg-gray-100"
              }`}
            >
              <Video size={16} /> Video
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-8">
            <CareerTipsSkeleton count={6} />
          </div>
        ) : errorMsg ? (
          <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 py-20 text-center text-red-600">
            <div className="mb-2 text-xl font-bold">Terjadi Kesalahan</div>
            <p className="text-sm font-medium">{errorMsg}</p>
          </div>
        ) : filteredContents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center text-gray-500">
            <p className="text-lg font-medium">
              {search
                ? "Konten tidak ditemukan."
                : "Belum ada konten diterbitkan."}
            </p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`${activeTab}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {visibleContents.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        {item.type === "video" ? (
                          <Video size={54} />
                        ) : (
                          <Book size={54} />
                        )}
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
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                          item.type === "article"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {item.type === "article" ? "Artikel" : "Video"}
                      </span>
                      {(item.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={`${item.id}-${tag}`}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-xl font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-gray-600">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/${locale}/career-tips/${item.slug}`}
                      className="text-primaryBlue mt-auto inline-flex w-fit items-center text-sm font-medium hover:underline"
                    >
                      {item.type === "article"
                        ? "Baca Artikel"
                        : "Tonton Video"}
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>

            {!isAllVisible && (
              <div className="mt-8 flex justify-center">
                <motion.button
                  onClick={handleLoadMore}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="bg-primaryBlue hover:bg-primaryBlue/90 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white"
                >
                  <MoveDown size={16} /> Muat Lebih Banyak
                </motion.button>
              </div>
            )}
          </AnimatePresence>
        )}
      </section>
    </main>
  );
}
