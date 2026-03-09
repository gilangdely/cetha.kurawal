"use client";

import ActivityHistory from "@/components/activity-history";
import PencapaianTerbaru from "@/components/dashboard/pencapaian";
import Profile from "@/components/dashboard/profile";
import TargetKarir from "@/components/dashboard/target-karir";

export default function Page() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* LEFT */}
      <div className="space-y-4 lg:col-span-8">
        <Profile />
        <ActivityHistory />
      </div>

      {/* RIGHT */}
      <div className="space-y-4 lg:col-span-4">
        <PencapaianTerbaru />

        <TargetKarir />
      </div>
    </div>
  );
}
