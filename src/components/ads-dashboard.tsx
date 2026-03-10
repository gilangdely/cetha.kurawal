"use client";

import React, { useState, useEffect, useRef } from "react";

import AdsDashboardCvReview from "./ads-dashboard-cv-review";
import AdsDashboardCvBuilder from "./ads-dashboard-cv-builder";
import AdsDashboardImproveLinkedin from "./ads-dashboard-improve-linkedin";
import AdsDashboardJobFinder from "./ads-dashboard-job-finder";

// ─── Carousel ───────────────────────────────────────────────────────────────

const slides = [
  { id: "cv-review", Component: AdsDashboardCvReview },
  //   { id: "cv-builder", Component: AdsDashboardCvBuilder },
  //   { id: "linkedin", Component: AdsDashboardImproveLinkedin },
  //   { id: "job-finder", Component: AdsDashboardJobFinder },
];

const AUTOPLAY_DELAY = 4500;
const TRANSITION_DURATION = 500; // ms

export default function AdsCarouselSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [displayed, setDisplayed] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (index: number, dir: "next" | "prev" = "next") => {
    if (animating || index === current) return;
    setDirection(dir);
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => {
      setDisplayed(index);
      setAnimating(false);
    }, TRANSITION_DURATION);
  };

  //   const next = () => {
  //     const nextIdx = (current + 1) % slides.length;
  //     goTo(nextIdx, "next");
  //   };

  const next = () => {
    if (slides.length <= 1) return;

    const nextIdx = (current + 1) % slides.length;
    goTo(nextIdx, "next");
  };

  //   const prev = () => {
  //     const prevIdx = (current - 1 + slides.length) % slides.length;
  //     goTo(prevIdx, "prev");
  //   };

  const prev = () => {
    if (slides.length <= 1) return;

    const prevIdx = (current - 1 + slides.length) % slides.length;
    goTo(prevIdx, "prev");
  };

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setTimeout(next, AUTOPLAY_DELAY);
    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
    };
  }, [current, animating]);

  const CurrentComponent = slides[displayed].Component;

  return (
    <>
      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .slide-enter-next {
          animation: slideInFromRight ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1) both;
        }
        .slide-enter-prev {
          animation: slideInFromLeft ${TRANSITION_DURATION}ms cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>

      <section className="bg-Background text-TextPrimary relative overflow-hidden rounded-3xl p-6 shadow-sm md:p-8">
        {/* Decorative blobs */}
        <div className="bg-primaryBlue/15 pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
        <div className="bg-accentOrange/10 pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl" />

        {/* Slide content */}
        <div
          key={displayed}
          className={
            direction === "next" ? "slide-enter-next" : "slide-enter-prev"
          }
        >
          <CurrentComponent />
        </div>

        {/* Pagination + Nav */}
        <div className="mt-8 flex items-center justify-between">
          {/* Dots */}
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "next" : "prev")}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "bg-primaryBlue w-10"
                    : "bg-primaryBlue/20 hover:bg-primaryBlue/40 w-5"
                }`}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex gap-2">
            <button
              onClick={prev}
              className="border-primaryBlue/20 text-primaryBlue hover:bg-primaryBlue flex h-9 w-9 items-center justify-center rounded-full border bg-white transition hover:text-white disabled:opacity-30"
              disabled={animating}
            >
              ‹
            </button>

            <button
              onClick={next}
              className="border-primaryBlue/20 text-primaryBlue hover:bg-primaryBlue flex h-9 w-9 items-center justify-center rounded-full border bg-white transition hover:text-white disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
