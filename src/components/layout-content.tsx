import { useSidebar } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CethaBot from "./cetha-bot";
import AppTopbar from "./app-topbar";
import { useUploadStore } from "@/store/uploadStore";
import { usePathname } from "next/navigation";
import LoadingScreen from "./loading-screen";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const pathname = usePathname();

  const loading = useUploadStore((s) => s.uploading);
  const progress = useUploadStore((s) => s.progress);
  const uploadType = useUploadStore((s) => s.uploadType);

  const isExcluded = [
    "/dashboard/result-cv",
    "/dashboard/job-match-result",
  ].includes(pathname);

  return (
    <>
      {loading && <LoadingScreen type={uploadType ?? "cv"} />}
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
    </>
  );
}
