"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const path = pathname.replace(/^\/[a-z]{2}/, "");

  const isProfile = path === "/dashboard/my-profile";
  const isSubscription = path.startsWith("/dashboard/my-profile/subscription");
  const isSettings = path.startsWith("/dashboard/my-profile/settings");

  return (
    <div className="p-2 text-gray-900 lg:p-4">
      <div className="mx-auto w-full space-y-6">
        {/* TOP NAV */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-4">
          <Link
            href="/dashboard/my-profile"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isProfile
                ? "bg-primaryBlue text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Profile Settings
          </Link>

          <Link
            href="/dashboard/my-profile/subscription"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isSubscription
                ? "bg-primaryBlue text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Harga / Subscription
          </Link>

          <Link
            href="/dashboard/my-profile/settings"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              isSettings
                ? "bg-primaryBlue text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Pengaturan
          </Link>
        </div>

        {/* PAGE CONTENT */}
        {children}
      </div>
    </div>
  );
}
