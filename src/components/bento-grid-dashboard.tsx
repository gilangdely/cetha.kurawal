"use client";

import { ArrowUpRight, Zap, Briefcase, Trophy } from "lucide-react";
import UserQuotaWidget from "@/components/dashboard/user-quota-widget";
import DreamOccupation from "@/components/dashboard/dream-occupation";
import { useState, useEffect } from "react";
import { db, auth } from "@/app/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { useTranslations } from "next-intl";

const BentoGridDashboard = () => {
  const t = useTranslations("DashboardStats");
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [careerScore, setCareerScore] = useState<number | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "pencapaian"),
      where("userId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTotalAchievements(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  // Fetch latest CV review score
  useEffect(() => {
    const fetchLatestScore = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "cvReviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1),
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          const result = data.result?.[0];
          if (result?.skor_keseluruhan != null) {
            setCareerScore(result.skor_keseluruhan);
          }
        }
      } catch (error) {
        console.error("Failed to fetch career score:", error);
      }
    };

    fetchLatestScore();
  }, []);

  const stats = [
    {
      label: t("careerScore"),
      value: careerScore != null ? `${careerScore} / 100` : t("noScoreYet"),
      icon: Zap,
      theme: "bg-white border border-slate-200 text-slate-900",
    },
    {
      label: t("totalAchievements"),
      value: `${totalAchievements} ${t("achievementsUnit")}`,
      icon: Trophy,
      theme: "bg-white border border-slate-200 text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Pekerjaan Impian */}
      <DreamOccupation />

      {/* Stats lainnya */}
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl p-5 transition-all duration-300 hover:shadow-sm ${stat.theme}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                  <Icon size={21} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-70">{stat.label}</p>
                  <p className="line-clamp-1 max-w-40 text-xl font-black tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        );
      })}

      <UserQuotaWidget />
    </div>
  );
};

export default BentoGridDashboard;
