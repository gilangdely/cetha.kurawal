"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { CardsLoginStack } from "../cards-login-stack";
import { AiBeam } from "../ai-beam";
import { OptimalizeLinkedIn } from "../optimalize-linkedIn";
import { InfiniteMovingJobs } from "../infinite-moving-jobs";

const stepsOrder = ["register", "cv", "linkedin", "jobs"];

const content = [
  { id: 1, content: CardsLoginStack },
  { id: 2, content: AiBeam },
  { id: 3, content: OptimalizeLinkedIn },
  { id: 4, content: InfiniteMovingJobs },
];

const HowItWorksSection = () => {
  const t = useTranslations("HowItWorks");
  const [activeStep, setActiveStep] = useState(1);

  const stepKey = stepsOrder[activeStep - 1];
  const activeContent = content.find((item) => item.id === activeStep);

  return (
    <motion.section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center"
      >
        <div className="border-primaryBlue/40 bg-primaryBlue/5 rounded-full border px-3 py-1">
          <p className="text-primaryBlue text-sm font-medium tracking-wide">
            {t("badge")}
          </p>
        </div>

        <div className="mt-4 max-w-2xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            {t("title")}
          </h2>
          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            {t("description")}
          </p>
        </div>
      </motion.div>

      {/* MAIN CONTENT – ENTRANCE ONLY WHEN IN VIEW */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-10"
      >
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="border-primaryBlue/15 flex w-full flex-col rounded-2xl border bg-white/80 p-6 shadow-sm md:h-96 md:flex-row"
        >
          <div className="flex w-full items-center justify-center md:w-1/2">
            {activeContent?.content && <activeContent.content />}
          </div>

          <div className="mt-6 flex w-full flex-col justify-center md:mt-0 md:w-1/2">
            <span className="text-primaryBlue text-sm font-semibold">
              STEP 0{activeStep}
            </span>

            <h3 className="text-TextPrimary mt-1 text-2xl font-semibold">
              {t(`steps.${stepKey}.title`)}
            </h3>

            <p className="text-TextSecondary mt-2 text-base">
              {t(`steps.${stepKey}.description`)}
            </p>

            <ul className="mt-5 space-y-3">
              {t
                .raw(`steps.${stepKey}.features`)
                .map((feature: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CircleCheck size={18} className="text-primaryBlue mt-1" />
                    <p className="text-sm">
                      <span className="text-TextPrimary font-medium">
                        {feature.highlight}
                      </span>{" "}
                      <span className="text-TextSecondary">{feature.text}</span>
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* STEP SELECTOR */}
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stepsOrder.map((key, idx) => {
          const isActive = activeStep === idx + 1;

          return (
            <motion.button
              key={key}
              onClick={() => setActiveStep(idx + 1)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                ease: "easeOut",
                delay: idx * 0.12,
              }}
              viewport={{ once: true }}
              className={`group relative flex flex-col border-t-4 bg-white p-4 text-start transition-all duration-300 ease-out ${
                isActive
                  ? "border-primaryBlue bg-primaryBlue/10"
                  : "hover:border-primaryBlue/60 border-gray-200"
              }`}
            >
              <span className="bg-primaryBlue/5 pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <h4 className="relative text-lg font-semibold">0{idx + 1}</h4>

              <p
                className={`relative mt-1 font-semibold transition-colors duration-300 ${
                  isActive ? "text-primaryBlue" : "text-TextPrimary"
                }`}
              >
                {t(`steps.${key}.title`)}
              </p>

              <p className="text-TextSecondary relative mt-2 line-clamp-3 text-sm">
                {t(`steps.${key}.description`)}
              </p>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
