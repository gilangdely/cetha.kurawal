"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function UpgradeModal({ isOpen, onClose, message }: UpgradeModalProps) {
  const router = useRouter();
  const toastIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    if (isOpen) {
      toastIdRef.current = toast.error("Token kamu tidak cukup untuk fitur ini. Silakan top-up atau upgrade paket langganan untuk melanjutkan.", {

        duration: 8000,
        position: "top-right",
        closeButton: true,
        onDismiss: () => {
          onClose();
        },
        onAutoClose: () => {
          onClose();
        },

      });
    } else {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
    }
  }, [isOpen, message, onClose, router]);

  return null;
}
