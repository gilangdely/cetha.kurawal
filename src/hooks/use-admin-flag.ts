// src/hooks/use-admin-flag.ts
"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";

export function useAdminFlag() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        // force refresh supaya claim baru langsung kebaca
        const token = await user.getIdTokenResult(true);
        setIsAdmin(!!token.claims.admin);
      } catch (error) {
        console.error("Gagal membaca admin claim:", error);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return isAdmin;
}

