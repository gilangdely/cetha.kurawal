"use client";

import React, { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

import AdsDashboardCvReview from "./ads-dashboard-cv-review";
import AdsDashboardCvBuilder from "./ads-dashboard-cv-builder";
import AdsDashboardImproveLinkedin from "./ads-dashboard-improve-linkedin";
import AdsDashboardJobFinder from "./ads-dashboard-job-finder";

// ─── Carousel ───────────────────────────────────────────────────────────────

const slides = [
  { id: "cv-review", Component: AdsDashboardCvReview },
  { id: "cv-builder", Component: AdsDashboardCvBuilder },
  { id: "linkedin", Component: AdsDashboardImproveLinkedin },
  { id: "job-finder", Component: AdsDashboardJobFinder },
];

const AUTOPLAY_DELAY = 4500;

export default function AdsCarouselSection() {
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const goTo = (index: number) => {
    if (!swiperRef.current || index === current) return;
    swiperRef.current.slideToLoop(index);
  };

  const next = () => {
    swiperRef.current?.slideNext();
  };

  const prev = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <section className="bg-Background text-TextPrimary relative overflow-hidden rounded-3xl p-6 shadow-sm md:p-8">
      {/* Decorative blobs */}
      <div className="bg-primaryBlue/15 pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl" />
      <div className="bg-accentOrange/10 pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl" />

      <div className="relative z-10">
        <Swiper
          modules={[Autoplay, EffectFade]}
          loop
          speed={500}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: AUTOPLAY_DELAY,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setCurrent(swiper.realIndex);
          }}
          onSlideChange={(swiper) => setCurrent(swiper.realIndex)}
          className="h-full overflow-hidden"
        >
          {slides.map(({ id, Component }) => (
            <SwiperSlide key={id} className="h-auto">
              <Component />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Pagination + Nav */}
      <div className="relative z-10 mt-6 flex items-center justify-between">
        {/* Dots */}
        <div className="flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to ${slide.id}`}
              onClick={() => goTo(i)}
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
            type="button"
            aria-label="Previous slide"
            onClick={prev}
            className="border-primaryBlue/20 text-primaryBlue hover:bg-primaryBlue flex h-9 w-9 items-center justify-center rounded-full border bg-white transition hover:text-white"
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Next slide"
            onClick={next}
            className="border-primaryBlue/20 text-primaryBlue hover:bg-primaryBlue flex h-9 w-9 items-center justify-center rounded-full border bg-white transition hover:text-white"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
