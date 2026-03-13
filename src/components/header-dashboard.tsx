"use client";

import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const HeaderDashboard = () => {
  const t = useTranslations("DashboardHeader");

  const [username, setUsername] = useState(t("fallbackUsername"));
  const [greeting, setGreeting] = useState("");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 11) return t("greeting.morning");
    if (hour >= 11 && hour < 15) return t("greeting.afternoon");
    if (hour >= 15 && hour < 18) return t("greeting.evening");

    return t("greeting.night");
  };

  const getDailySubtitle = () => {
    const dayOfYear = Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );

    const subtitles = t.raw("subtitles");

    const index = dayOfYear % subtitles.length;

    return t.rich(`subtitles.${index}`, {
      b: (chunks) => (
        <span className="font-semibold text-slate-900 italic">{chunks}</span>
      ),
    });
  };

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || t("fallbackUsername"));
        } else {
          setUsername(user.displayName || t("fallbackUsername"));
        }
      } catch (error) {
        console.error("Gagal mengambil user:", error);
      }
    };

    loadUser();

    setGreeting(getGreeting());

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, [t]);

  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        {greeting}, {username}! <span className="text-slate-400">🚀</span>
      </h1>

      <p className="max-w-xl text-base text-slate-500">{getDailySubtitle()}</p>
    </div>
  );
};

export default HeaderDashboard;
