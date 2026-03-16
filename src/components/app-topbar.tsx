"use client";

import React, { useEffect, useState, useRef } from "react";
import { auth } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { logoutUser } from "@/app/lib/auth";
import {
  Bell,
  User,
  ChevronDown,
  LogOut,
  Menu,
  Settings2,
  X,
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
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import Link from "next/link";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "./ui/breadcrumb";
import { useTranslations } from "next-intl";
import { useNotificationStore } from "@/store/useNotificationStore";
import { motion, AnimatePresence } from "framer-motion";

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

const AppTopbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();
  const t = useTranslations("dashboard.topbar");

  const [username, setUsername] = useState(t("fallbackUsername"));
  const [email, setEmail] = useState("m@example.com");
  const [openDialog, setOpenDialog] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openNotifMenu, setOpenNotifMenu] = useState(false);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const isCompactScreen = useMediaQuery("(max-width: 1024px)");

  const {
    notifications,
    unreadCount,
    initListener,
    markAsRead,
    clearListener,
  } = useNotificationStore();

  const isSidebarOpen = state === "expanded";

  const pathSegments = pathname
    .split("/")
    .filter(
      (segment) => segment !== "" && segment !== "id" && segment !== "en",
    );

  const handleSidebarToggle = () => {
    setOpen(!isSidebarOpen);
  };

  const formatSegment = (segment: string) => {
    const key = `routes.${segment}` as any;
    if (t.has(key)) {
      return t(key);
    }
    // Fallback for dynamic slugs (e.g. article slugs): title-case
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const breadcrumbItems =
    pathSegments.length > 3
      ? [
          { key: "ellipsis", label: "...", href: "", isCurrent: false },
          ...pathSegments.slice(-2).map((segment, idx) => {
            const segmentIndex = pathSegments.length - 2 + idx;
            return {
              key: `${segment}-${segmentIndex}`,
              label: formatSegment(segment),
              href: "/" + pathSegments.slice(0, segmentIndex + 1).join("/"),
              isCurrent: idx === 1,
            };
          }),
        ]
      : pathSegments.map((segment, index) => ({
          key: `${segment}-${index}`,
          label: formatSegment(segment),
          href: "/" + pathSegments.slice(0, index + 1).join("/"),
          isCurrent: index === pathSegments.length - 1,
        }));

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
                t("fallbackUsername"),
            );
          }

          const res = await fetch("/api/me");
          if (res.ok) {
            const data = await res.json();
            const userIsAdmin = data.role === "admin";
            setIsAdmin(userIsAdmin);

            // Inisialisasi listener untuk semua user dashboard
            initListener(user.uid, userIsAdmin);
          } else {
            // Jika gagal ambil data role, tetap nyalakan listener sebagai user biasa (fallback)
            setIsAdmin(false);
            initListener(user.uid, false);
          }
        } catch (e) {
          console.error("Failed to fetch user data", e);
          setIsAdmin(false);
          initListener(user.uid, false);
        }
      } else {
        setIsAdmin(false);
        clearListener();
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notifMenuRef.current &&
        !notifMenuRef.current.contains(event.target as Node)
      ) {
        setOpenNotifMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logoutUser();

    toast.success(t("messages.logoutSuccess"));

    router.push("/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 print:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger
              onClick={handleSidebarToggle}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-gray-100 md:hidden"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </SidebarTrigger>

            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
                {breadcrumbItems.map((item, index) => {
                  return (
                    <React.Fragment key={item.key}>
                      <BreadcrumbItem className="max-w-[8rem] min-w-0 sm:max-w-[11rem]">
                        {item.isCurrent || item.label === "..." ? (
                          <BreadcrumbPage className="truncate">
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link href={item.href} className="block truncate">
                              {item.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>

                      {index < breadcrumbItems.length - 1 && (
                        <BreadcrumbSeparator className="shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {isAdmin && (
            <>
              <div className="hidden h-6 w-[1px] bg-gray-200 lg:block" />
              <span className="hidden text-sm text-gray-500 lg:block">
                {t("welcomeAdmin")}
              </span>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1">
            <div className="relative" ref={notifMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenNotifMenu(!openNotifMenu);
                }}
                className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {openNotifMenu && (
                  <>
                    {isCompactScreen && (
                      <motion.button
                        type="button"
                        aria-label="Close notifications overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setOpenNotifMenu(false)}
                        className="fixed top-16 right-0 bottom-0 left-0 z-[90] bg-slate-950/20 backdrop-blur-sm"
                      />
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className={`z-[100] flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ${
                        isCompactScreen
                          ? "fixed top-20 right-4 left-4 max-h-[min(24rem,calc(100vh-6rem))]"
                          : "absolute right-0 mt-2 w-80"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
                        <span className="text-sm font-bold text-gray-800">
                          {t("notifications.title")}
                        </span>

                        {isCompactScreen && (
                          <button
                            onClick={() => setOpenNotifMenu(false)}
                            className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      <div className="flex min-h-0 w-full flex-col overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-400">
                            {t("notifications.empty")}
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => {
                                if (!notif.isRead) markAsRead(notif.id);
                                if (notif.link) router.push(notif.link);
                                setOpenNotifMenu(false);
                              }}
                              className={`flex flex-col gap-1 border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${!notif.isRead ? "bg-blue-50/30" : ""}`}
                            >
                              <div className="flex w-full items-start justify-between gap-2">
                                <span
                                  className={`text-sm ${!notif.isRead ? "font-bold text-gray-900" : "font-semibold text-gray-700"} truncate`}
                                >
                                  {notif.title}
                                </span>
                                {!notif.isRead && (
                                  <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                                )}
                              </div>
                              <span className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                                {notif.message}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                      {notifications.length > 5 && (
                        <Link
                          href="/dashboard"
                          className="text-primaryBlue border-t border-gray-100 px-4 py-2.5 text-center text-xs font-semibold transition hover:bg-gray-50"
                        >
                          {t("notifications.viewAll")}
                        </Link>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

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

            <DropdownMenuContent
              align="end"
              sideOffset={20}
              className="z-50 !w-54 !min-w-[12rem]"
            >
              <DropdownMenuLabel className="block font-normal lg:hidden">
                <div className="flex flex-col space-y-1">
                  <p className="truncate text-sm font-medium">{username}</p>
                  <p className="text-muted-foreground text-xs">{email}</p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="block lg:hidden" />

              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link
                  href={"/dashboard/my-profile"}
                  className="flex w-full items-center gap-2"
                >
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span>{t("profile")}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer py-2.5">
                <Link
                  href={"/dashboard/my-profile/settings"}
                  className="flex w-full items-center gap-2"
                >
                  <Settings2 className="mr-3 h-4 w-4 text-gray-500" />
                  <span>{t("settings")}</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="cursor-pointer py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => setOpenDialog(true)}
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>{t("logout")}</span>
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
