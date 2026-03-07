"use client";

import ActivityHistory from "@/components/activity-history";
import PencapaianTerbaru from "@/components/dashboard/pencapaian";
import Profile from "@/components/dashboard/profile";

export default function ProfilePage() {
  return (
    <div className="p-2 text-gray-900 lg:p-4">
      <div className="mx-auto w-full space-y-6">
        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="space-y-8 lg:col-span-8">
            <Profile />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4 lg:col-span-4">
            <PencapaianTerbaru />
            <ActivityHistory />
          </div>
        </div>
      </div>
    </div>
  );
}
