"use client";

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutContent } from "@/components/layout-content";
import { AppSidebar } from "@/components/app-sidebar";
import { Menu } from "lucide-react";
import CethaBot from "@/components/cetha-bot";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/login");
      } else {
        setAuthChecked(true);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!authChecked) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <SidebarProvider>
        <LayoutContent>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </LayoutContent>
      </SidebarProvider>
    </div>
  );
}
