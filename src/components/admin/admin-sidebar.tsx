"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { auth } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";

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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { LayoutDashboard, Newspaper, FileText, Blocks, Settings, LogOut, LayoutTemplate, ChevronsUpDown } from "lucide-react";
import logo from "@/assets/icons/cetha-logo.svg";

import { Avatar } from "@/components/ui/avatar";
import UserAvatar from "@/components/user-avatar";
import LogoutAlert from "@/components/logout-alert";

const nav = [
  { label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pilihan Tier Langganan", href: "/admin/subscription-tiers", icon: Blocks },
  { label: "Verifikasi Pembayaran", href: "/admin/subscriptions", icon: FileText },
  { label: "Kelola Konten & Tips", href: "/admin/contents", icon: Newspaper },
  { label: "Pengaturan Situs", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("Admin Cetha");
  const [email, setEmail] = useState("admin@cetha.id");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || user.email?.split("@")[0] || "Admin");
        setEmail(user.email || "admin@cetha.id");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  return (
    <>
      <Sidebar className="border-r bg-white/90 backdrop-blur">
        <SidebarHeader className="flex items-center justify-start pt-4">
          <Link href={"/admin"} className="text-TextPrimary flex h-12 items-center gap-2 text-lg font-semibold">
            <Image alt="logo cetha" src={logo} height={60} />
            <span className="text-[10px] font-bold bg-accentOrange text-white px-2 py-0.5 rounded ml-1 tracking-wider uppercase shadow-sm">ADMIN</span>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sm">Manajemen Situs</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item, i) => {
                  const active = item.href === "/admin" ? pathname.endsWith("/admin") : pathname.includes(item.href);

                  return (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild variant={"default"}>
                        <Link
                          href={item.href}
                          className={`hover:bg-accent/50 flex !hover:text-primaryBlue items-center gap-3 rounded-md px-3 !py-6 text-sm font-medium transition-all duration-150 ${active ? "text-primaryBlue font-semibold bg-blue-50/50" : "text-gray-600"}`}
                        >
                          <item.icon className={`${active ? "text-primaryBlue" : "text-muted-foreground"} !h-6 !w-6`} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}

                <div className="mt-8 px-2">
                  <div className="border border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 mb-2">
                    <p className="text-xs text-gray-500 font-medium mb-3 text-center">Beralih ke mode Pengguna Biasa</p>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild variant={"default"}>
                        <Link
                          href="/dashboard"
                          className="flex justify-center items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 !py-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 shadow-sm"
                        >
                          <LayoutTemplate className="text-gray-500 !h-4 !w-4" />
                          <span>Web User UI</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </div>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-accent/50 mb-2 flex w-full items-center justify-between rounded-md px-2 py-2 text-sm transition-all duration-150 focus:outline-none">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 ring-2 ring-accentOrange ring-offset-1">
                    <UserAvatar />
                  </Avatar>
                  <div className="flex flex-col items-start w-[120px]">
                    <span className="text-sm font-semibold text-gray-900 truncate w-full text-left">{username}</span>
                    <span className="text-muted-foreground text-xs truncate w-full text-left">{email}</span>
                  </div>
                </div>
                <ChevronsUpDown size={16} className="text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="right" align="end" className="w-56 rounded-xl shadow-lg border-gray-100">
              <DropdownMenuLabel className="font-normal bg-gray-50/50 pb-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{username}</p>
                  <p className="text-muted-foreground text-xs">{email}</p>
                  <p className="text-[10px] uppercase font-bold text-accentOrange mt-1">Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/id/settings")} className="cursor-pointer py-2">
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan Akun</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenDialog(true)} className="cursor-pointer py-2 focus:bg-red-50 focus:text-red-600 group">
                <LogOut className="mr-2 h-4 w-4 text-red-500 group-hover:text-red-600" />
                <span className="text-red-500 font-medium group-hover:text-red-600">Keluar Sistem</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <LogoutAlert openDialog={openDialog} setOpenDialog={setOpenDialog} handleLogout={handleLogout} />
    </>
  );
}