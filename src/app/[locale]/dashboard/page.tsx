"use client";

import TargetKarir from "@/components/dashboard/target-karir";
import PencapaianTerbaru from "@/components/dashboard/pencapaian";
import ActivityHistory from "@/components/activity-history";
import HeaderDashboard from "@/components/header-dashboard";
import BentoGridDashboard from "@/components/bento-grid-dashboard";
import ProfileDashboard from "@/components/dashboard/profile-dashboard";
import AdsDashboardSection from "@/components/ads-dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-2 text-gray-900 lg:p-4">
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
            <AdsDashboardSection />

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
              <ProfileDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
