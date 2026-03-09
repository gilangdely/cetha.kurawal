"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";
import {
  Bell,
  Search,
  User,
  Settings,
  HelpCircle,
  ChevronDown,
  LogOut,
  Menu,
  Settings2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./ui/avatar";
import UserAvatar from "./user-avatar";
import LogoutAlert from "./logout-alert";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import Link from "next/link";

const AppTopbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("Cetha");
  const [email, setEmail] = useState("m@example.com");
  const [openDialog, setOpenDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const showSearch = pathname.includes("/dashboard/tips-karir");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setEmail(user.email || "m@example.com");

        try {
          const userRef = doc(db, "users", user.uid);
          const snap = await getDoc(userRef);

          if (snap.exists()) {
            const data = snap.data();

            setUsername(
              data.username ||
                user.displayName ||
                user.email?.split("@")[0] ||
                "Pengguna",
            );
          }

          const res = await fetch("/api/me");
          if (res.ok) {
            const data = await res.json();
            setIsAdmin(data.role === "admin");
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
        }
      } else {
        setIsAdmin(false);
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
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 lg:hidden">
              <Menu className="h-5 w-5 text-gray-600" />
            </SidebarTrigger>
            <h1 className="text-lg font-bold tracking-tight text-gray-900 lg:text-xl">
              Dashboard
            </h1>
          </div>
          {isAdmin && (
            <>
              <div className="hidden h-6 w-[1px] bg-gray-200 lg:block" />
              <span className="hidden text-sm text-gray-500 lg:block">
                Welcome back, Admin
              </span>
            </>
          )}
        </div>

        {/* BAGIAN KANAN: Search & Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar (Hidden on mobile) */}
          {showSearch && (
            <div className="relative hidden md:block">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari Artikel atau Video..."
                className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 pr-4 pl-10 text-sm transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
          )}

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-2 flex items-center gap-3 border-l border-gray-200 pl-4 transition-opacity outline-none hover:opacity-80">
                <div className="hidden flex-col items-end text-right lg:flex">
                  <p className="text-sm leading-none font-semibold text-gray-900">
                    {username}
                  </p>
                  <span className="text-muted-foreground mt-0.5 text-xs">
                    {email}
                  </span>
                </div>

                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <UserAvatar />
                  </Avatar>
                </div>

                <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
              </button>
            </DropdownMenuTrigger>

            {/* Konten Dropdown */}
            <DropdownMenuContent
              align="end"
              sideOffset={20} // Memberi jarak agar tidak menempel ke trigger
              className="z-50 !w-54 !min-w-[12rem] transition-all"
            >
              <DropdownMenuLabel className="blocl font-normal lg:hidden">
                <div className="flex flex-col space-y-1">
                  <p className="truncate text-sm leading-none font-medium text-gray-900">
                    {username}
                  </p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs leading-none">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="block lg:hidden" />

              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link
                  href={"/dashboard/my-profile"}
                  className="flex w-full items-center gap-2"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Profil Saya</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link
                  href={"/dashboard/my-profile/settings"}
                  className="flex w-full items-center gap-2"
                >
                  <Settings2 className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Pengaturan</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => setOpenDialog(true)}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <LogoutAlert
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default AppTopbar;
