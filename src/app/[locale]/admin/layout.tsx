// app/[locale]/admin/layout.tsx

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-layout-content";
import { getCurrentUserProfile } from "@/app/lib/session";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default async function Layout({ children }: { children: ReactNode }) {
  const profile = await getCurrentUserProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== "admin") {
    redirect("/403");
  }

  return (
    <div>
      <SidebarProvider>
        <AdminShell>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </AdminShell>
      </SidebarProvider>
    </div>
  );
}
