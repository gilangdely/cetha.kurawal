import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      {props.children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "#2563EB",
            color: "#ffffff",
            border: "1px solid #1D4ED8",
            borderRadius: "12px",
            fontWeight: "500",
            boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
          },
        }}
      />
    </>
  );
}
