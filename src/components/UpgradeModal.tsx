"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
            <DialogContent className="sm:max-w-md text-center">
                <DialogHeader className="flex flex-col items-center pt-4">
                    <div className="bg-orange-100 p-4 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-accentOrange" />
                    </div>
                    <DialogTitle className="text-xl font-bold">Batas Penggunaan Tercapai</DialogTitle>
                    <DialogDescription className="text-base mt-2 text-gray-600">
                        {message || "Kamu telah mencapai batas penggunaan AI harian. Silakan berlangganan untuk akses tanpa batas."}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-center w-full pb-4">
                    <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-12 px-6">
                        Nanti Saja
                    </Button>
                    <Button
                        onClick={() => router.push("/id/daftar-harga")}
                        className="w-full sm:w-auto h-12 px-6 bg-primaryBlue hover:bg-blue-700 text-white gap-2 shadow-sm font-semibold"
                    >
                        <Zap size={18} /> Upgrade Sekarang
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
