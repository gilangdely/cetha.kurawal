"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@/app/lib/firebase";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Home,
  FileSearch,
  FileText,
  Linkedin,
  Briefcase,
  Newspaper,
  Settings2,
  Menu,
  Gift,
  Tag,
  ArrowUpRight,
} from "lucide-react";

import logo from "@/assets/icons/cetha-new-logo.svg";
import favicon from "@/assets/icons/favicon-white-new.svg";

const mainMenu = [
  { title: "Dashboard", icon: Home, href: "/dashboard" },
  { title: "CV Review", icon: FileSearch, href: "/dashboard/review-cv" },
  {
    title: "CV Builder",
    icon: FileText,
    href: "/dashboard/cv-builder",
  },
  {
    title: "Improve LinkedIn",
    icon: Linkedin,
    href: "/dashboard/tingkatkan-linkedIn",
  },
  {
    title: "Find Jobs AI",
    icon: Briefcase,
    href: "/dashboard/rekomendasi-pekerjaan",
  },
  { title: "Artikel & Video", icon: Newspaper, href: "/dashboard/tips-karir" },
];

export function AppSidebar() {
  const pathname = usePathname();

  const { state } = useSidebar();
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isExpanded = state === "expanded";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await fetch("/api/me");

          if (res.ok) {
            const data = await res.json();
            setIsAdmin(data.role === "admin");
          }
        } catch (e) {
          console.error("Role fetch error");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const res = await fetch("/api/user/subscription");
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch (error) {
        console.error("Error fetching quota:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuota();
  }, []);

  const remaining = data?.quota?.remaining_quota ?? 0;

  // Pesan berdasarkan token
  let message = "";

  if (remaining <= 2) {
    message =
      "Tokenmu hampir habis. Tambahkan token agar AI tetap bisa digunakan.";
  } else if (remaining <= 10) {
    message =
      "Tokenmu mulai menipis. Gunakan dengan bijak atau tambahkan token.";
  } else if (remaining > 40) {
    message = "Tokenmu masih aman. Gunakan AI untuk meningkatkan kariermu.";
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      {/* HEADER */}
      <SidebarHeader className="h-20 justify-center">
        <div
          className={`flex items-center px-4 transition-all duration-300 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <Link
              href="/dashboard"
              className="animate-in fade-in flex items-center duration-500"
            >
              <Image
                alt="logo"
                src={logo}
                width={100}
                priority
                className="object-contain"
              />
            </Link>
          )}

          <SidebarTrigger
            className={`rounded-lg transition-colors hover:bg-gray-100 ${
              isExpanded ? "h-9 w-9" : "h-10 w-10"
            }`}
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </SidebarTrigger>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="scrollbar-none px-2">
        <SidebarGroupLabel
          className={`mb-2 px-2 text-xs font-bold tracking-wider text-gray-400 uppercase transition-opacity ${
            isExpanded ? "opacity-100" : "opacity-0"
          }`}
        >
          Main Navigation
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu className="gap-0.5">
            {mainMenu.map((item) => {
              const isActive = pathname === item.href;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    <Link
                      href={item.href}
                      className={`group relative flex h-10 items-center rounded-xl transition-all duration-200 ${
                        isExpanded ? "gap-3 px-3" : "justify-center"
                      } ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg ring-1 shadow-blue-200 ring-blue-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`!h-5 !w-5 shrink-0 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />

                      {isExpanded && (
                        <span className="text-sm font-semibold">
                          {item.title}
                        </span>
                      )}

                      {isActive && isExpanded && (
                        <div className="absolute right-3 h-2 w-1 rounded-full bg-blue-200/50" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4">
        <SidebarMenuButton asChild tooltip="Lihat Harga">
          <Link
            href="/dashboard/my-profile/subscription"
            className={`group flex h-12 items-center rounded-xl transition-all ${
              isExpanded ? "gap-3" : "relative right-2 justify-center"
            } ${
              pathname === "/dashboard/my-profile/subscription"
                ? "bg-blue-100 font-semibold text-blue-700"
                : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            <Tag
              className={`!h-5 !w-5 ${
                pathname === "/dashboard/my-profile/subscription"
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-blue-500"
              }`}
            />

            {isExpanded && (
              <span className="text-sm font-semibold">Lihat Harga</span>
            )}
          </Link>
        </SidebarMenuButton>

        {/* Admin Panel */}
        {isAdmin && (
          <SidebarMenuButton asChild tooltip="Admin Panel">
            <Link
              href="/admin"
              className={`group flex h-12 items-center rounded-xl transition-all ${
                isExpanded ? "gap-3" : "relative right-2 justify-center"
              } ${
                pathname === "/admin"
                  ? "bg-orange-100 font-semibold text-orange-700"
                  : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              <Settings2
                className={`!h-5 !w-5 ${
                  pathname === "/admin"
                    ? "text-orange-600"
                    : "text-gray-400 group-hover:text-orange-500"
                }`}
              />

              {isExpanded && (
                <span className="text-sm font-semibold">Admin Panel</span>
              )}
            </Link>
          </SidebarMenuButton>
        )}

        {isExpanded ? (
          !loading &&
          data && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              layout
              className="relative mt-3 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-5 text-white shadow-xl shadow-blue-200/40"
            >
              <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-indigo-400/20 blur-2xl" />

              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2">
                  <Image src={favicon} alt="favicon" className="h-7 w-7" />
                  <span className="text-xs font-bold tracking-[0.18em] text-blue-100 uppercase">
                    Cetha Plus+
                  </span>
                </div>

                {message && (
                  <p className="mb-4 text-sm leading-relaxed text-white/90">
                    {message}
                  </p>
                )}

                <Link
                  href="/upgrade"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-2 text-xs font-semibold text-blue-700 shadow-sm transition-all hover:-translate-y-[1px] hover:shadow-md active:translate-y-0"
                >
                  Tambah Token
                  <ArrowUpRight size={14} className="ml-1" />
                </Link>
              </div>
            </motion.div>
          )
        ) : (
          <SidebarMenuButton
            asChild
            tooltip="Upgrade"
            className="group relative right-2"
          >
            <Link
              href="/upgrade"
              className={`relative flex items-center rounded-xl transition-all duration-200 ${
                isExpanded ? "h-10 gap-3 px-3" : "h-10 w-10 justify-center"
              } ${
                pathname === "/upgrade"
                  ? "bg-blue-600 text-white shadow-lg ring-1 shadow-blue-200 ring-blue-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Gift
                className={`!h-5 !w-5 shrink-0 transition-colors ${
                  pathname === "/upgrade"
                    ? "text-white"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />

              {isExpanded && (
                <span className="text-sm font-semibold">Upgrade</span>
              )}

              {pathname === "/upgrade" && isExpanded && (
                <div className="absolute right-3 h-2 w-1 rounded-full bg-blue-200/50" />
              )}
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
