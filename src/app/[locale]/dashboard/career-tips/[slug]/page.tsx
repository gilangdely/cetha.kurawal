"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Book, Calendar, User, Video } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export default function TipsKarirDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const slug = params.slug as string;
    if (!slug) return;

    const loadContent = async () => {
      try {
        const res = await fetch(`/api/contents/${slug}`);
        const json = await res.json();

        if (!res.ok || !json.success) {
          setError("Konten tidak ditemukan atau belum dipublikasikan.");
        } else {
          setContent(json.data);
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan sistem saat memuat.");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="border-primaryBlue h-10 w-10 animate-spin rounded-full border-t-2 border-b-2" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="w-full p-4 py-10 text-center md:px-10">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">{error}</h2>
        <button
          onClick={() => router.back()}
          className="text-primaryBlue inline-flex items-center hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" /> Kembali
        </button>
      </div>
    );
  }

  // Safety rendering via DOMPurify
  const cleanHtml = content.contentHtml
    ? DOMPurify.sanitize(content.contentHtml)
    : "";
  const dateTitle = content.publishedAt
    ? new Date(content.publishedAt._seconds * 1000).toLocaleDateString(
        "id-ID",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : "Baru saja";

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:px-10">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/id/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/id/dashboard/career-tips">
              Tips Karier
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="max-w-[150px] truncate sm:max-w-[250px] md:max-w-xs">
              {content.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Link
        href="/id/dashboard/career-tips"
        className="mb-6 inline-flex items-center text-gray-500 transition hover:text-gray-800"
      >
        <ArrowLeft size={18} className="mr-1" /> Kembali ke List
      </Link>

      <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header Metadata */}
        <div className="border-b border-gray-100 px-6 py-8 md:px-10 md:py-10">
          <div className="mb-4 flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${content.type === "article" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}
            >
              {content.type === "article" ? (
                <Book size={16} />
              ) : (
                <Video size={16} />
              )}
              <span className="capitalize">
                {content.type === "article" ? "Artikel" : "Vidio"}
              </span>
            </span>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={16} />
              <span>{dateTitle}</span>
            </div>
          </div>
          <h1 className="text-3xl leading-tight font-extrabold text-gray-900 md:text-4xl">
            {content.title}
          </h1>

          {content.tags && content.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {content.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content Renderer Base on Type */}
        <div className="px-6 py-8 md:px-10 md:py-12">
          {content.type === "video" && content.youtubeUrl ? (
            <div className="w-full">
              <div className="border-accentOrange mb-8 rounded-r-lg border-l-4 bg-gray-50 p-4 font-medium text-gray-700">
                {content.excerpt}
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                <iframe
                  src={content.youtubeUrl}
                  title={content.title}
                  className="absolute top-0 left-0 h-full w-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            </div>
          ) : content.type === "article" ? (
            <div
              className="prose prose-blue sm:prose-lg w-full max-w-none leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          ) : null}
        </div>
      </article>
    </div>
  );
}
