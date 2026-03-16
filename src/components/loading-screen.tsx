"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useUploadStore } from "@/store/uploadStore";
import { useTranslations } from "next-intl";

import loadingIcons1 from "@/assets/icons/loading-bulb.svg";
import loadingIcons2 from "@/assets/icons/loading-horse.svg";
import loadingIcons3 from "@/assets/icons/loading-paperline.svg";

interface LoadingScreenProps {
  type: "cv" | "job" | "linkedin";
}

const Icons = [loadingIcons1, loadingIcons2, loadingIcons3];

const LoadingScreen: React.FC<LoadingScreenProps> = ({ type }) => {
  const t = useTranslations("loadingScreen");
  const targetProgress = useUploadStore((s) => s.progress);
  const [dots, setDots] = useState("");
  const [currentIcon, setCurrentIcon] = useState(0);
  const [iconPhase, setIconPhase] = useState<"in" | "out">("in");
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
    let switchTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      setIconPhase("out");

      switchTimeout = setTimeout(() => {
        setCurrentIcon((prev) => (prev + 1) % Icons.length);
        setIconPhase("in");
      }, 140);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (switchTimeout) clearTimeout(switchTimeout);
    };
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
    if (displayedProgress < 50) return t("types.cv.stage1");
    if (displayedProgress < 80)
      return t("types.cv.stage2");
    return t("types.cv.stage3");
  };

  const getTextJob = () => {
    if (displayedProgress < 50) return t("types.job.stage1");
    if (displayedProgress < 80)
      return t("types.job.stage2");
    return t("types.job.stage3");
  };

  const getTextLinkedin = () => {
    if (displayedProgress < 50) return t("types.linkedin.stage1");
    if (displayedProgress < 80)
      return t("types.linkedin.stage2");
    return t("types.linkedin.stage3");
  };

  const getText =
    type === "cv" ? getTextCv : type === "job" ? getTextJob : getTextLinkedin;

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
      ? t("eta.lessThanOneSecond")
      : t("eta.seconds", { seconds: estimatedRemainingSec });

  return (
    <div className="fixed inset-0 z-999 overscroll-none bg-white">
      {/* CENTER CONTENT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="mb-6 flex h-16 w-16 items-center justify-center">
          <motion.div
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={
              iconPhase === "in"
                ? { y: 0, opacity: 1, scale: 1 }
                : { y: -12, opacity: 0, scale: 0.92 }
            }
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Image
              src={Icons[currentIcon]}
              alt={t("iconAlt")}
              className="h-16 w-16"
            />
          </motion.div>
        </div>

        <p className="max-w-md text-center text-lg text-gray-700 md:max-w-xl">
          {getText()}
          {dots}
        </p>
      </div>

      {/* BOTTOM PROGRESS */}
      <div className="absolute bottom-10 left-1/2 w-full max-w-xs -translate-x-1/2 px-4 text-center">
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
