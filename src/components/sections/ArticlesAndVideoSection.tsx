import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import ArticlesAndVideoSkeleton from "../articles-video-skeleton";

const ArticlesAndVideoSection = () => {
  const t = useTranslations("ArticleAndVideo");

  const [video, setVideo] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const contentsRef = collection(db, "contents");

        // VIDEO TERBARU
        const videoQuery = query(
          contentsRef,
          where("status", "==", "published"),
          where("type", "==", "video"),
          orderBy("publishedAt", "desc"),
          limit(1),
        );

        const videoSnap = await getDocs(videoQuery);
        if (!videoSnap.empty) {
          setVideo(videoSnap.docs[0].data());
        }

        // 3 ARTIKEL TERBARU
        const articleQuery = query(
          contentsRef,
          where("status", "==", "published"),
          where("type", "==", "article"),
          orderBy("publishedAt", "desc"),
          limit(3),
        );

        const articleSnap = await getDocs(articleQuery);
        const articleList = articleSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setArticles(articleList);
      } catch (error) {
        console.error("Error fetching contents:", error);
      } finally {
        setLoading(false); // <- pastikan loading di-set false
      }
    };

    fetchContents();
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      {/* HEADER & BADGE tetap tampil normal */}
      <div className="flex flex-col items-center text-center">
        <div className="border-primaryBlue/40 bg-primaryBlue/5 mx-auto w-fit rounded-full border px-3 py-1">
          <p className="text-primaryBlue text-sm font-medium tracking-wide">
            {t("badge")}
          </p>
        </div>
        <div className="mt-4 max-w-2xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            {t("title")}
          </h2>

          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            {t("description")}
          </p>
        </div>
      </div>

      {/* LOADING SKELETON */}
      {loading ? (
        <ArticlesAndVideoSkeleton />
      ) : (
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-8">
          {/* VIDEO */}
          <div className="w-full md:flex-1">
            <div className="p-1">
              <div className="aspect-video w-full overflow-hidden rounded-2xl bg-gray-300 shadow-sm">
                {video && (
                  <iframe
                    src={video.youtubeUrl}
                    className="h-full w-full"
                    allowFullScreen
                  />
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-neutral-500">
                  {video?.publishedAt?.toDate().toLocaleDateString()}
                </p>

                <h3 className="mt-2 text-lg leading-snug font-semibold text-neutral-900">
                  {video?.title}
                </h3>
              </div>
            </div>
          </div>

          {/* Divider Mobile Only */}
          <div className="block h-px w-full bg-neutral-200 md:hidden" />

          {/* ARTICLES */}
          <div className="w-full space-y-3 md:flex-1">
            {articles.map((article) => (
              <Link
                href={`/career-tips/${article.slug}`}
                key={article.id}
                className="flex flex-col gap-4 rounded-2xl bg-white p-4 transition hover:shadow-sm md:flex-row md:p-2"
              >
                <div className="h-40 w-full flex-shrink-0 overflow-hidden rounded-xl md:h-32 md:w-48">
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-300" />
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-500">
                      {article.publishedAt?.toDate().toLocaleDateString()}
                    </p>

                    <h3 className="mt-1 text-base leading-snug font-semibold text-neutral-900">
                      {article.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-600">
                      {article.excerpt}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            {/* Desktop Divider */}
            <hr className="my-6 hidden border-neutral-200 md:block" />

            <div className="mt-4">
              <Link
                href="/career-tips"
                className="group border-primaryBlue bg-primaryBlue hover:bg-primaryBlueHover inline-flex w-full items-center justify-between rounded-xl border px-6 py-4 text-white transition-all duration-300 hover:shadow-md"
              >
                <span className="text-base font-semibold tracking-tight">
                  {t("cta")}
                </span>

                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ArticlesAndVideoSection;
