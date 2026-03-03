"use client";

import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex flex-1 min-h-screen bg-Background lg:p-3 w-full">
        {/* Sidebar Admin */}
        <AdminSidebar />

        {/* Main Content Admin */}
        <div className="flex flex-1 flex-col overflow-hidden w-full lg:ml-2">
          {/* Header Mobile / Topbar */}
          <AdminTopbar />

          {/* Area Utama Konten */}
          <main className="flex flex-1 flex-col bg-white lg:p-6 p-4 lg:rounded-2xl lg:shadow-[0_2px_20px_rgba(0,0,0,0.02)] border-gray-100 border w-full h-full overflow-y-auto overflow-x-hidden">
            <div className="mx-auto w-full max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}