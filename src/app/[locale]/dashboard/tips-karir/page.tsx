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
} from "lucide-react";

import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";

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

    // Tab filtering (all, article, video)
    const [activeTab, setActiveTab] = useState<"all" | "article" | "video">("all");

    const [visibleCount, setVisibleCount] = useState(4);
    const initialVisible = 4;

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

    const filteredContents = contents.filter(c => activeTab === "all" ? true : c.type === activeTab);
    const visibleContents = filteredContents.slice(0, visibleCount);
    const isAllVisible = visibleCount >= filteredContents.length;

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    };

    const handleTabChange = (tab: "all" | "article" | "video") => {
        setActiveTab(tab);
        setVisibleCount(initialVisible);
    };

    return (
        <div className="w-full p-4 md:px-10">
            {/* Breadcrumb */}
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/id/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Tips Karier</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header Section */}
            <div className="mt-6 mb-8">
                <h2 className="text-TextPrimary text-3xl font-semibold">
                    Jelajahi{" "}
                    <span className="text-accentOrange">Tips Karier</span>
                </h2>
                <p className="text-TextSecondary mt-2 max-w-2xl text-base">
                    Tingkatkan wawasan kariermu dengan berbagai artikel dan video informatif yang membantu kamu menjadi lebih siap menghadapi dunia kerja.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-3 mb-6">
                <button
                    onClick={() => handleTabChange("all")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === "all"
                        ? "bg-primaryBlue text-white"
                        : "bg-Background border border-gray-200 text-TextSecondary hover:bg-gray-50"
                        }`}
                >
                    <LayoutGrid size={18} /> Semua
                </button>
                <button
                    onClick={() => handleTabChange("article")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === "article"
                        ? "bg-primaryBlue text-white"
                        : "bg-Background border border-gray-200 text-TextSecondary hover:bg-gray-50"
                        }`}
                >
                    <Book size={18} /> Artikel
                </button>
                <button
                    onClick={() => handleTabChange("video")}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === "video"
                        ? "bg-primaryBlue text-white"
                        : "bg-Background border border-gray-200 text-TextSecondary hover:bg-gray-50"
                        }`}
                >
                    <Video size={18} /> Video
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
                </div>
            ) : errorMsg ? (
                <div className="py-20 text-center text-red-600 bg-red-50 rounded-2xl border border-dashed border-red-200">
                    <div className="text-xl font-bold mb-2">Terjadi Kesalahan</div>
                    <p className="text-sm font-medium">{errorMsg}</p>
                    <p className="text-xs mt-2 opacity-70">Jika ini index Error Firestore, admin harus menekan link di console terminal</p>
                </div>
            ) : filteredContents.length === 0 ? (
                <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-lg font-medium">Belum ada konten diterbitkan.</p>
                </div>
            ) : (
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="grid w-full gap-8 mt-6 md:grid-cols-2"
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
                                <div className="relative h-60 w-full bg-gray-100 flex items-center justify-center">
                                    {item.coverImageUrl ? (
                                        <Image
                                            src={item.coverImageUrl}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
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
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition">
                                            <PlayCircle size={56} className="text-white opacity-90 drop-shadow-md" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${item.type === "article" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                                            {item.type === "article" ? "Artikel" : "Vidio"}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-TextPrimary mb-2 line-clamp-2 text-lg font-semibold">
                                        {item.title}
                                    </h3>
                                    <p className="text-TextSecondary mb-4 line-clamp-2 text-sm leading-relaxed flex-1">
                                        {item.excerpt}
                                    </p>
                                    <Link
                                        href={`/id/dashboard/tips-karir/${item.slug}`}
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
