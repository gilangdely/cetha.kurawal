"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
  LayoutDashboard,
  Newspaper,
  FileText,
  Blocks,
  Settings,
  LayoutTemplate,
  Menu,
} from "lucide-react";

import logo from "@/assets/icons/cetha-new-logo.svg";

const adminMenu = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Plans", href: "/admin/subscription-tiers", icon: Blocks },
  { title: "Payments", href: "/admin/subscriptions", icon: FileText },
  { title: "Content", href: "/admin/contents", icon: Newspaper },
  { title: "Site Settings", href: "/admin/settings", icon: Settings },
];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();

  const isMobile = useMediaQuery("(max-width: 767px)");
  const prevMobile = useRef(isMobile);

  const isExpanded = state === "expanded" || isMobile;

  const sidebarMode = isMobile ? "offcanvas" : "icon";

  useEffect(() => {
    if (prevMobile.current !== isMobile) {
      if (isMobile) {
        setOpen(false);
      }
    }

    prevMobile.current = isMobile;
  }, [isMobile, setOpen]);

  return (
    <Sidebar
      collapsible={sidebarMode}
      className="border-r border-gray-200 bg-white"
    >
      {/* HEADER */}
      <SidebarHeader className="h-20 justify-center">
        <div
          className={`flex items-center px-4 transition-all duration-300 ${
            isExpanded ? "justify-between" : "justify-center"
          }`}
        >
          {isExpanded && (
            <Link
              href="/admin"
              className="animate-in fade-in flex items-center duration-500"
            >
              <Image
                alt="logo"
                src={logo}
                width={100}
                priority
                className="object-contain"
              />
              <span className="bg-accentOrange ml-1 rounded px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm">
                ADMIN
              </span>
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
          Manajemen Situs
        </SidebarGroupLabel>

        <SidebarGroupContent>
          <SidebarMenu className="gap-0.5">
            {adminMenu.map((item) => {
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
        <SidebarMenuButton asChild tooltip="Web User UI">
          <Link
            href="/dashboard"
            className={`group flex h-10 items-center rounded-xl transition-all ${
              isExpanded ? "gap-3" : "relative right-2 justify-center"
            } ${
              pathname === "/dashboard"
                ? "bg-orange-100 font-semibold text-orange-700"
                : "text-gray-500 hover:bg-orange-50 hover:text-orange-600"
            }`}
          >
            <LayoutTemplate
              className={`!h-5 !w-5 ${
                pathname === "/dashboard"
                  ? "text-orange-600"
                  : "text-gray-400 group-hover:text-orange-500"
              }`}
            />

            {isExpanded && (
              <span className="text-sm font-semibold">Web User UI</span>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
