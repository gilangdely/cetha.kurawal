"use client";

import { ReactNode } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import CethaBot from "@/components/cetha-bot";
import { useUploadStore } from "@/store/uploadStore";
import LoadingScreen from "@/components/loading-screen";

export default function Layout(props: { children: ReactNode }) {
  const pathname = usePathname();
  const loading = useUploadStore((s) => s.uploading);
  const uploadType = useUploadStore((s) => s.uploadType);

  const isExcluded = ["/result-cv", "/job-match-result"].includes(pathname);

  const isCheckout =
    pathname.includes("/pricing/") && pathname.includes("/checkout");

  if (isExcluded) {
    return (
      <>
        {loading && <LoadingScreen type={uploadType ?? "cv"} />}
        {props.children}
        <CethaBot />
        <Toaster position="top-right" richColors closeButton />
      </>
    );
  }

  return (
    <>
      {loading && <LoadingScreen type={uploadType ?? "cv"} />}
      {isCheckout ? <> </> : <Navbar />}
      {props.children}
      {/* <Toaster position="top-right" richColors closeButton /> */}
      {isCheckout ? <> </> : <CethaBot />}
      {isCheckout ? <> </> : <Footer />}
    </>
  );
}
