"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

export function AdminTopbar() {
  const pathname = usePathname();
  let title = "Admin Dashboard";

  if (pathname.includes("/admin/contents")) title = "Kelola Konten & Tips";
  else if (pathname.includes("/admin/pages")) title = "Kelola Halaman";
  else if (pathname.includes("/admin/landing")) title = "Landing Sections";
  else if (pathname.includes("/admin/settings")) title = "Site Settings";

  return (
    <header className="flex items-center gap-4 border-b bg-white px-4 py-3 shadow-sm lg:hidden sm:px-6 mb-2 rounded-xl">
      <SidebarTrigger className="lg:hidden shrink-0">
        <Menu className="h-5 w-5 text-gray-700" />
      </SidebarTrigger>

      <div className="flex-1">
        <h1 className="text-sm font-semibold text-gray-800 line-clamp-1">{title}</h1>
      </div>

      <div className="flex items-center bg-gray-100/80 rounded-full px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500 max-w-[140px]">
        <Search size={14} className="text-gray-400 mr-2 shrink-0" />
        <Input
          placeholder="Cari..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-6 text-xs"
        />
      </div>
    </header>
  );
}