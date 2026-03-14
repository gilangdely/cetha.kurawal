"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Clock, BookOpenText, Briefcase, ChevronRight } from "lucide-react";
import { db } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth } from "@/app/lib/firebase";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CvReview {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  result: any; // Sesuaikan dengan struktur result dari API review
  createdAt: string;
}

export default function ActivityHistory() {
  const t = useTranslations("activityHistory");
  const [activities, setActivities] = useState<CvReview[]>([]); // Gunakan CvReview untuk riwayat CV
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error(t("loginRequired"));
      setLoading(false);
      return;
    }

    // Query riwayat CV review (top 2 terbaru untuk tampilan ringkas)
    const q = query(
      collection(db, "cvReviews"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      // Limit 2 untuk ringkas, atau hapus untuk semua
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CvReview[];
        setActivities(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching activities:", error);
        toast.error(t("loadError"));
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const handleItemClick = (review: CvReview) => {
    // Redirect ke halaman hasil dengan param ID untuk load data spesifik
    router.push(`/dashboard/result-cv?id=${review.id}`);
  };

  // Skeleton loading untuk 2 item
  if (loading) {
    return (
      <div className="space-y-4 pt-4">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 animate-pulse rounded-md bg-slate-200"></div>
            <div className="h-6 w-40 animate-pulse rounded-md bg-slate-200"></div>
          </div>
          <div className="h-4 w-16 animate-pulse rounded-md bg-slate-200"></div>
        </div>
        {/* Box Skeleton */}
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-3xl border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <div className="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-slate-100"></div>
                <div className="w-full space-y-3">
                  <div className="h-4 w-1/3 animate-pulse rounded-md bg-slate-100"></div>
                  <div className="h-3 w-2/3 animate-pulse rounded-md bg-slate-100"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          {t("title")}
        </h4>

        {activities.length > 0 && (
          <Link
            href="/dashboard/history-review-cv"
            title={t("viewAll")}
            className="group flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-slate-800 hover:shadow-sm active:scale-95"
          >
            {t("viewAll")}
            <ChevronRight
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.slice(0, 4).map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleItemClick(activity)}
              className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {/* icon */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm">
                    <BookOpenText size={16} />
                  </div>

                  {/* text */}
                  <div className="min-w-0">
                    <h5 className="truncate text-sm font-semibold text-slate-800">
                      {activity.fileName}
                    </h5>

                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {new Date(activity.createdAt).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}{" "}
                      —{" "}
                      {activity.result?.summary ||
                        activity.result?.description ||
                        t("defaultInsight")}
                    </p>
                  </div>
                </div>

                {/* action */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-200 group-hover:bg-indigo-600 group-hover:text-white">
                  <ChevronRight size={16} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <BookOpenText size={22} className="text-slate-300" />
            </div>

            <p className="text-sm font-semibold text-slate-700">
              {t("empty.title")}
            </p>

            <p className="mt-1 mb-4 text-xs text-slate-400">
              {t("empty.description")}
            </p>

            <Link
              href="/dashboard/review-cv"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              {t("empty.cta")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
