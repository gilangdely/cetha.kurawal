"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import CvReviewResult from "@/components/cv-review-result";
import { useDataReviewStore } from "@/store/dataReviewStore";

export default function ResultReviewCv() {
  const router = useRouter();
  const reviewData = useDataReviewStore((state) => state.reviewData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useDataReviewStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useDataReviewStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && !reviewData?.result) {
      router.push("/dashboard/review-cv");
    }
  }, [hydrated, reviewData, router]);

  if (!hydrated || !reviewData?.result) return null;

  return (
    <div className="w-full">
      <div className="mt-6 mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            Hasil Review CV Kamu
          </h1>
          <p className="text-TextSecondary mt-2 max-w-2xl text-sm md:text-base">
            Berikut hasil analisis AI terhadap CV yang telah kamu unggah.
          </p>
        </div>

        <button
          onClick={() => {
            router.push("/dashboard/review-cv");
          }}
          className="bg-primaryBlue flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ArrowLeft size={16} />
          Kembali ke Review CV
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="grid gap-8"
      >
        <CvReviewResult />
      </motion.div>
    </div>
  );
}
