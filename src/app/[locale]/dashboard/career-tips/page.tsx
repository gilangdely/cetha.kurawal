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
    <div className="w-full space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-TextPrimary text-3xl font-semibold">
            Jelajahi <span className="text-accentOrange">Tips Karier</span>
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="mt-4 flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
            <Search className="h-4 w-4 text-gray-400" />

            <input
              type="text"
              placeholder="Cari artikel atau video..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(initialVisible);
              }}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>

          <button
            onClick={() => handleTabChange("all")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "all"
                ? "bg-primaryBlue text-white"
                : "bg-Background text-TextSecondary border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid size={18} /> Semua
          </button>
          <button
            onClick={() => handleTabChange("article")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "article"
                ? "bg-primaryBlue text-white"
                : "bg-Background text-TextSecondary border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Book size={18} /> Artikel
          </button>
          <button
            onClick={() => handleTabChange("video")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "video"
                ? "bg-primaryBlue text-white"
                : "bg-Background text-TextSecondary border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Video size={18} /> Video
          </button>
        </div>
      </div>

      {/* Tabs */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-500" />
        </div>
      ) : errorMsg ? (
        <div className="rounded-2xl border border-dashed border-red-200 bg-red-50 py-20 text-center text-red-600">
          <div className="mb-2 text-xl font-bold">Terjadi Kesalahan</div>
          <p className="text-sm font-medium">{errorMsg}</p>
          <p className="mt-2 text-xs opacity-70">
            Jika ini index Error Firestore, admin harus menekan link di console
            terminal
          </p>
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
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleContents.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                  {item.coverImageUrl ? (
                    <Image
                      src={item.coverImageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : item.type === "video" ? (
                    <div className="text-gray-300">
                      <Video size={64} />
                    </div>
                  ) : (
                    <div className="text-gray-300">
                      <Book size={64} />
                    </div>
                  )}
                  {/* Video Indicator Overlay */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30">
                      <PlayCircle
                        size={56}
                        className="text-white opacity-90 drop-shadow-md"
                      />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold shadow-sm ${item.type === "article" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
                    >
                      {item.type === "article" ? "Artikel" : "Vidio"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-TextPrimary mb-2 line-clamp-2 text-lg font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-TextSecondary mb-4 line-clamp-2 flex-1 text-sm leading-relaxed">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/id/dashboard/career-tips/${item.slug}`}
                    className="text-primaryBlue mt-auto inline-flex w-fit items-center text-sm font-medium hover:underline"
                  >
                    {item.type === "article" ? "Baca Artikel" : "Tonton Vidio"}
                    <ArrowRight size={16} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {!isAllVisible && !loading && contents.length > 0 && (
        <div className="mt-8 flex justify-center">
          <motion.button
            onClick={handleLoadMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primaryBlue hover:bg-primaryBlue/90 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white transition"
          >
            <MoveDown size={16} /> Muat Lebih Banyak
          </motion.button>
        </div>
      )}
    </div>
  );
}
