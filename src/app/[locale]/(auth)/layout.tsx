import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export default function Layout(props: { children: ReactNode }) {
  return (
    <>
      {props.children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
