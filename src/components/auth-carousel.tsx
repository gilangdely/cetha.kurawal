"use client";

import "swiper/css";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "motion/react";
import { useCarouselStore } from "@/store/carouselStore";
import { useTranslations } from "next-intl";

import login1 from "@/assets/img/login-image1.jpg";
import login2 from "@/assets/img/login-image2.jpg";
import login3 from "@/assets/img/login-image3.jpg";

const carouselImage = [login1, login2, login3];

export default function AuthCarousel() {
  const { activeIndex, setActiveIndex } = useCarouselStore();
  const t = useTranslations("authCarousel");

  const carouselQuotes = t.raw("quotes");
  const currentQuote = carouselQuotes[activeIndex];

  return (
    <motion.div
      className="relative hidden w-full max-w-xl items-center justify-center p-3 lg:flex"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        initialSlide={activeIndex}
        className="h-full w-full overflow-hidden rounded-xl"
      >
        {carouselImage.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              <img
                src={img.src}
                alt="Auth Carousel"
                className="h-full w-full scale-105 object-cover transition-transform duration-[4000ms] ease-in-out"
                style={{ filter: "brightness(0.85)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Quote Overlay */}
      <div className="pointer-events-none absolute right-10 bottom-10 left-10 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-md text-white"
          >
            <p className="text-xl leading-relaxed font-semibold">
              “{currentQuote.quote}”
            </p>

            <div className="mt-4 text-sm opacity-90">
              <p className="font-medium">{currentQuote.name}</p>
              <p className="opacity-80">{currentQuote.role}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
