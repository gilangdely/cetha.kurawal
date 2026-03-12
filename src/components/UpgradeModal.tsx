"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock, Zap } from "lucide-react";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export function UpgradeModal({ isOpen, onClose, message }: UpgradeModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="text-center sm:max-w-md">
        <DialogHeader className="flex flex-col items-center pt-4">
          <div className="mb-4 rounded-full bg-orange-100 p-4">
            <Lock className="text-accentOrange h-8 w-8" />
          </div>
          <DialogTitle className="text-xl font-bold">
            Batas Penggunaan Tercapai
          </DialogTitle>
          <DialogDescription className="mt-2 text-base text-gray-600">
            {message ||
              "Kamu telah mencapai batas penggunaan AI harian. Silakan berlangganan untuk akses tanpa batas."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex w-full flex-col gap-3 pb-4 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 w-full px-6 sm:w-auto"
          >
            Nanti Saja
          </Button>
          <Button
            onClick={() => router.push("/pricing")}
            className="bg-primaryBlue h-12 w-full gap-2 px-6 font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
          >
            <Zap size={18} /> Upgrade Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
