import { Menu } from "lucide-react";
import { SidebarTrigger, useSidebar } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CethaBot from "./cetha-bot";
import AppTopbar from "./app-topbar";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />

        <main className="flex flex-1 p-4">
          <div className="flex w-full flex-col rounded-2xl bg-white p-2">
            {children}
          </div>
        </main>

        <CethaBot />
      </div>
    </div>
  );
}
