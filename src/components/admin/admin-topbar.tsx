"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  ChevronDown,
  Search,
  User,
  Settings,
  LogOut,
  Settings2,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser } from "@/app/lib/auth";
import { toast } from "sonner";
import UserAvatar from "../user-avatar";
import LogoutAlert from "../logout-alert";

export function AdminTopbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [username, setUsername] = useState("Cetha");
  const [email, setEmail] = useState("m@example.com");
  const [openDialog, setOpenDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pathSegments = pathname
    .split("/")
    .filter(
      (segment) => segment !== "" && segment !== "id" && segment !== "en",
    );

  const formatSegment = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
    toast.success("Logout Berhasil");
    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden">
            <Menu className="h-5 w-5 text-gray-600" />
          </SidebarTrigger>

          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const href = "/" + pathSegments.slice(0, index + 1).join("/");

                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {index === pathSegments.length - 1 ? (
                        <BreadcrumbPage>
                          {formatSegment(segment)}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={href}>{formatSegment(segment)}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {index < pathSegments.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
          {isAdmin && (
            <>
              <div className="hidden h-6 w-[1px] bg-gray-200 lg:block" />
              <span className="hidden text-sm text-gray-500 lg:block">
                Welcome back, Admin
              </span>
            </>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <Bell className="h-5 w-5" />
          </button>

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
              <DropdownMenuLabel className="block font-normal lg:hidden">
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
}
