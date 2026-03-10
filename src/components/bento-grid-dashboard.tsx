"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Target, Zap, Briefcase } from "lucide-react";
import { db, auth } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserQuotaWidget from "@/components/dashboard/user-quota-widget";
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

const BentoGridDashboard = () => {
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
        }
      } catch (error) {
        console.error("Error fetching dream job:", error);
        setDreamJob("Gagal memuat");
      }
    };

    fetchDreamJob();
  }, []);

  const stats = [
    {
      label: "Pekerjaan Impian",
      value: dreamJob,
      icon: Target,
      theme: "bg-primaryBlue text-white",
    },
    {
      label: "Career Score",
      value: "82 / 100",
      icon: Zap,
      theme: "bg-white border border-slate-200 text-slate-900",
    },
    {
      label: "Total Pencapaian",
      value: "14 Jobs",
      icon: Briefcase,
      theme: "bg-white border border-slate-200 text-slate-900",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <div
            key={i}
            className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl p-5 transition-all duration-300 hover:shadow-sm ${stat.theme}`}
            onClick={() => {
              if (stat.label === "Pekerjaan Impian")
                setIsDreamJobDialogOpen(true);
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                  <Icon size={21} strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-sm font-medium opacity-70">{stat.label}</p>
                  <p className="line-clamp-1 max-w-40 text-xl font-black tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        );
      })}

      <UserQuotaWidget />

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
    </div>
  );
};

export default BentoGridDashboard;
