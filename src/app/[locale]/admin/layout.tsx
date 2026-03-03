// app/[locale]/admin/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getCurrentUserProfile } from "@/app/lib/session";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    // Return back to appropriate login localized by next middleware
    redirect("/id/login");
  }

  if (profile.role !== "admin") {
    // Kick out regular users from admin layouts
    redirect("/id/403");
  }

  return <AdminShell>{children}</AdminShell>;
}
