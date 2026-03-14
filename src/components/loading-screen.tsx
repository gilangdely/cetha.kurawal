"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUploadStore } from "@/store/uploadStore";

import loadingIcons1 from "@/assets/icons/loading-bulb.svg";
import loadingIcons2 from "@/assets/icons/loading-horse.svg";
import loadingIcons3 from "@/assets/icons/loading-paperline.svg";

interface LoadingScreenProps {
  type: "cv" | "job";
}

const Icons = [loadingIcons1, loadingIcons2, loadingIcons3];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ type }) => {
  const targetProgress = useUploadStore((s) => s.progress);
  const [dots, setDots] = useState("");
  const [currentIcon, setCurrentIcon] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [elapsedSec, setElapsedSec] = useState(0);
  const [displayedProgress, setDisplayedProgress] = useState(0);

  const defaultTotalSec = type === "cv" ? 22 : 28;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % Icons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSec(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    setDisplayedProgress((prev) => {
      // Reset visual progress when a new upload flow starts.
      if (targetProgress <= 0) return 0;
      return prev;
    });
  }, [targetProgress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => {
        const safeTarget = Math.max(0, Math.min(targetProgress, 100));
        const visualTarget = safeTarget >= 100 ? 100 : Math.min(safeTarget, 98);

        if (prev >= visualTarget) return prev;

        const diff = visualTarget - prev;
        const step = Math.max(0.4, diff * 0.08);
        return Math.min(visualTarget, prev + step);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [targetProgress]);

  const getTextCv = () => {
    if (displayedProgress < 50) return "Sedang menganalisis CV kamu";
    if (displayedProgress < 80)
      return "Cari kata kunci yang pas biar HR gampang nemuin kamu";
    return "Siap! CV kamu akan jadi lebih siap dilirik recruiter.";
  };

  const getTextJob = () => {
    if (displayedProgress < 50)
      return "Mencari peluang kerja yang cocok buat kamu";
    if (displayedProgress < 80)
      return "Menganalisis keahlian dan preferensimu untuk hasil terbaik";
    return "Rekomendasi pekerjaan siap ditampilkan!";
  };

  const getText = type === "cv" ? getTextCv : getTextJob;

  const estimatedRemainingSec = (() => {
    const safeProgress = Math.max(0, Math.min(displayedProgress, 100));

    if (safeProgress >= 100) return 0;

    // Fallback when progress is still near-zero and speed is not measurable yet.
    if (safeProgress < 5 || elapsedSec <= 2) {
      return Math.max(1, defaultTotalSec - elapsedSec);
    }

    const ratePerSec = safeProgress / Math.max(elapsedSec, 1);
    if (ratePerSec <= 0) {
      return Math.max(1, defaultTotalSec - elapsedSec);
    }

    const computed = Math.ceil((100 - safeProgress) / ratePerSec);
    return Math.max(1, Math.min(120, computed));
  })();

  const etaLabel =
    estimatedRemainingSec <= 1
      ? "Kurang dari 1 detik lagi"
      : `Perkiraan selesai dalam ${estimatedRemainingSec} detik`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overscroll-none bg-white">
      <div className="mb-6 flex h-16 w-16 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIcon}
            initial={{ y: 20, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Image
              src={Icons[currentIcon]}
              alt="Loading"
              className="h-16 w-16"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="max-w-md text-center text-lg text-gray-700">
        {getText()}
        {dots}
      </p>

      <div className="mt-4 w-full max-w-xs px-4 text-center">
        <p className="text-sm font-medium text-gray-500">{etaLabel}</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="bg-primaryBlue h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.max(3, Math.min(displayedProgress, 100))}%`,
            }}
          />
        </div>
        <p className="mt-1 text-xs text-gray-400">
          {Math.round(displayedProgress)}%
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
