"use client";

import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";

export default function DreamOccupation() {
  const [isDreamJobDialogOpen, setIsDreamJobDialogOpen] = useState(false);
  const [dreamJob, setDreamJob] = useState("Loading...");

  useEffect(() => {
    const fetchDreamJob = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setDreamJob(data.dreamJob || "Belum ada pekerjaan impian");
        } else {
          setDreamJob("Belum ada pekerjaan impian");
        }
      } catch (error) {
        console.error("Error fetching dream job:", error);
        setDreamJob("Gagal memuat");
      }
    };

    fetchDreamJob();
  }, []);

  return (
    <>
      <div
        className="group bg-primaryBlue relative flex cursor-pointer flex-col justify-between rounded-3xl p-5 text-white transition-all duration-300 hover:shadow-sm"
        onClick={() => setIsDreamJobDialogOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
              {/* Icon Target */}
              <Target size={21} strokeWidth={2.5} />
            </div>

            <div>
              <p className="text-sm font-medium opacity-70">Pekerjaan Impian</p>
              <p className="line-clamp-1 max-w-40 text-xl font-black tracking-tight">
                {dreamJob}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={isDreamJobDialogOpen}
        onOpenChange={setIsDreamJobDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pekerjaan Impian</DialogTitle>
            <DialogDescription>
              Berikut adalah pekerjaan impianmu:
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 text-xl font-semibold break-words text-slate-800">
            {dreamJob}
          </div>

          <DialogFooter className="flex justify-end">
            <DialogClose asChild>
              <Button
                onClick={() => setIsDreamJobDialogOpen(false)}
                variant={"outline"}
                className="bg-primaryBlue hover:bg-primaryBlueHover text-white transition-all duration-300 hover:text-white"
              >
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
