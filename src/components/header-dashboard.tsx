"use client";

import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const DAILY_SUBTITLES = [
  <>
    Hari ini adalah kesempatan untuk{" "}
    <span className="font-semibold text-slate-900 italic">
      melangkah lebih jauh
    </span>{" "}
    dari kemarin.
  </>,
  <>
    Konsistensimu hari ini adalah{" "}
    <span className="font-semibold text-slate-900 italic">
      investasi masa depan
    </span>{" "}
    yang nyata.
  </>,
  <>
    Setiap langkah kecil membawamu lebih dekat ke{" "}
    <span className="font-semibold text-slate-900 italic">tujuan besarmu</span>.
  </>,
  <>
    Rekruter sedang mencari seseorang seperti{" "}
    <span className="font-semibold text-slate-900 italic">kamu</span> hari ini.
  </>,
  <>
    Profil yang kuat adalah{" "}
    <span className="font-semibold text-slate-900 italic">pintu masuk</span> ke
    peluang terbaik.
  </>,
  <>
    Jangan berhenti —{" "}
    <span className="font-semibold text-slate-900 italic">breakthrough</span>-mu
    mungkin tinggal selangkah lagi.
  </>,
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return "Selamat Pagi";
  if (hour >= 11 && hour < 15) return "Selamat Siang";
  if (hour >= 15 && hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const getDailySubtitle = () => {
  const dayOfYear = Math.floor(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return DAILY_SUBTITLES[dayOfYear % DAILY_SUBTITLES.length];
};

const HeaderDashboard = () => {
  const [username, setUsername] = useState("Explorer");
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const loadUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setUsername(data.username || "Explorer");
        } else {
          setUsername(user.displayName || "Explorer");
        }
      } catch (error) {
        console.error("Gagal mengambil user:", error);
      }
    };

    loadUser();

    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
