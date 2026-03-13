"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar />

        <main className="flex flex-1 p-4">
          <div className="flex w-full flex-col rounded-2xl bg-white p-2">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
