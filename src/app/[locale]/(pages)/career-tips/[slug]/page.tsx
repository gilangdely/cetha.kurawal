"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpenText,
  CalendarDays,
  PlayCircle,
} from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

interface ContentItem {
  id: string;
  type: "article" | "video";
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string | null;
  youtubeUrl: string | null;
  coverImageUrl: string | null;
  tags?: string[];
  publishedAt?: { _seconds?: number } | string | null;
}

function formatDate(dateInput: ContentItem["publishedAt"]) {
  if (!dateInput) return "Baru saja";

  if (typeof dateInput === "string") {
    const parsed = new Date(dateInput);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
    return "Baru saja";
  }

  if (typeof dateInput === "object" && dateInput._seconds) {
    return new Date(dateInput._seconds * 1000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return "Baru saja";
}

export default function CareerTipsDetailPage() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "id";
  const slug = typeof params.slug === "string" ? params.slug : "";

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!slug) return;

    const loadContent = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const res = await fetch(`/api/contents/${slug}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setErrorMsg("Konten tidak ditemukan atau belum dipublikasikan.");
          return;
        }

        setContent(json.data as ContentItem);
      } catch {
        setErrorMsg("Terjadi kesalahan saat memuat konten.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [slug]);

  const cleanHtml = useMemo(
    () => (content?.contentHtml ? DOMPurify.sanitize(content.contentHtml) : ""),
    [content?.contentHtml],
  );

  if (loading) {
    return (
      <div className="flex min-h-[72vh] items-center justify-center px-4 pt-28 pb-10">
        <div className="border-t-primaryBlue h-10 w-10 animate-spin rounded-full border-2 border-gray-300" />
      </div>
    );
  }

  if (errorMsg || !content) {
    return (
      <div className="mx-auto flex min-h-[72vh] w-full max-w-3xl flex-col items-center justify-center px-4 pt-28 pb-10 text-center sm:px-6">
        <h2 className="text-TextPrimary text-2xl font-semibold">{errorMsg}</h2>
        <Link
          href={`/${locale}/career-tips`}
          className="text-primaryBlue mt-6 inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft size={16} /> Kembali ke daftar konten
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-16 pt-18 pb-14 md:px-6 lg:min-h-screen lg:pt-28">
      <article className="overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="px-5 py-8 sm:px-8 md:px-10 md:py-10"
        >
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold ${
                content.type === "article"
                  ? "bg-primaryBlue/10 text-primaryBlue"
                  : "bg-sky-50 text-sky-700"
              }`}
            >
              {content.type === "article" ? "Artikel" : "Video"}
            </span>

            <span className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              {formatDate(content.publishedAt)}
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="font-careerTips text-3xl font-semibold text-gray-900 sm:text-4xl md:text-5xl">
              {content.title}
            </h1>

            {!!content.tags?.length && (
              <div className="flex flex-wrap gap-2 pt-1">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border-primaryBlue/15 bg-primaryBlue/5 text-primaryBlue rounded-full border px-3 py-1 text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <div className="px-5 py-3 sm:px-8 md:px-10 md:py-6">
          {content.coverImageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="relative mb-8 aspect-[16/8] w-full overflow-hidden border border-gray-200 bg-gray-100"
            >
              <Image
                src={content.coverImageUrl}
                alt={content.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
                unoptimized
              />
              {content.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/35 to-black/15">
                  <div className="bg-primaryBlue/90 rounded-full p-4 shadow-lg shadow-blue-500/20">
                    <PlayCircle size={38} className="fill-white text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {content.type === "video" && content.youtubeUrl ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
              className="space-y-4"
            >
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-gray-200 bg-black shadow-sm">
                <iframe
                  src={content.youtubeUrl}
                  title={content.title}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            >
              <div
                className="prose prose-neutral sm:prose-lg prose-headings:text-gray-900 prose-a:text-primaryBlue prose-strong:text-gray-900 max-w-none px-1 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            </motion.div>
          )}
        </div>
      </article>
    </div>
  );
}
