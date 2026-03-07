"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import {
  TrendingUp,
  Lightbulb,
  Target,
  Briefcase,
  Award,
  Zap,
  Sparkles,
  ArrowUpRight,
  LayoutDashboard,
  Star,
} from "lucide-react";
import TargetKarir from "@/components/dashboard/target-karir";
import PencapaianTerbaru from "@/components/dashboard/pencapaian";
import ProfilDashboard from "@/components/dashboard/profile-dashboard";
import ActivityHistory from "@/components/activity-history";
import UserQuotaWidget from "@/components/dashboard/user-quota-widget";
import HeaderDashboard from "@/components/header-dashboard";
import BentoGridDashboard from "@/components/bento-grid-dashboard";
import ProfileDashboard from "@/components/dashboard/profile-dashboard";

export default function DashboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  const steps = [
    "Mastering System Design 2026",
    "Simulasi AI Behavioral Interview",
    "Optimasi Portfolio Next.js 16",
  ];

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || "Explorer");
      setEmail(user.email || "");
    }
  }, []);

  return (
    <div className="min-h-screen p-2 text-gray-900 selection:bg-indigo-100 selection:text-indigo-700 lg:p-4">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <HeaderDashboard />

        {/* Bento Grid */}
        <BentoGridDashboard />

        {/* --- MAIN CONTENT AREA --- */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: The Focus Zone */}
          <div className="space-y-8 lg:col-span-8">
            {/* AI Recommendation Card (The "Main Attraction") */}
            <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl md:p-12">
              <div className="relative z-10 flex flex-col items-center gap-10 md:flex-row">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/20 px-4 py-1.5 text-xs font-bold tracking-widest text-indigo-400 uppercase">
                    Next Mission
                  </div>
                  <h3 className="text-3xl leading-tight font-bold">
                    Selesaikan Simulasi Interview untuk{" "}
                    <span className="text-indigo-400">Unlocking</span> Badge
                    Senior!
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {steps.map((s, i) => (
                      <span
                        key={i}
                        className="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="group flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50 transition-all hover:scale-110 hover:bg-indigo-400">
                  <Zap
                    className="fill-white group-hover:animate-pulse"
                    size={32}
                  />
                </button>
              </div>
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-[100px]" />
            </section>

            {/* Career Progress Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TargetKarir />
              <PencapaianTerbaru />
            </div>

            {/* History Section */}
            <ActivityHistory />
          </div>

          {/* RIGHT COLUMN: Sidebar */}
          <div className="space-y-8 lg:col-span-4">
            <div className="sticky top-20 space-y-8">
              {/* Profile - The Glassmorphism Touch */}
              <ProfileDashboard
                username={username}
                email={email}
                skills={["React", "AI Prompting", "TypeScript", "UI/UX"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
