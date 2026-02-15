"use client";

import { InfiniteMovingJobs } from "../infinite-moving-jobs";
import { OptimalizeLinkedIn } from "../optimalize-linkedIn";
import { AiBeam } from "../ai-beam";
import { CardsLoginStack } from "../cards-login-stack";
import { useState } from "react";
import { CircleCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

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
    <motion.section className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="flex flex-col items-center text-center">
        <div className="border-primaryBlue rounded-full border-2 px-2 py-1 lg:px-3 lg:py-1.5">
          <p className="text-primaryBlue font-medium">{t("badge")}</p>
        </div>
        <div className="mt-4 flex-col text-center">
          <h2 className="text-TextPrimary text-2xl lg:text-3xl font-semibold md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-TextSecondary mt-2 max-w-2xl text-base lg:text-lg">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6 md:flex-row">
        <div className="flex w-full flex-col rounded-lg border bg-white p-6 shadow-sm md:h-96 md:flex-row">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            {activeContent?.content && <activeContent.content />}
          </div>

          <div className="w-full md:w-1/2 mt-4 md:mt-0 md:pl-6 flex flex-col justify-center">
            <h3 className="text-2xl font-semibold">0{activeStep}</h3>
            <p className="text-primaryBlue mt-2 text-xl font-semibold">
              {t(`steps.${stepKey}.title`)}
            </p>
            <p className="text-TextSecondary my-3 text-base font-medium">
              {t(`steps.${stepKey}.description`)}
            </p>

            <hr className="my-5 rounded border-2 text-gray-200/70" />

            <ul className="flex flex-col gap-2">
              {t.raw(`steps.${stepKey}.features`).map(
                (feature: any, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <CircleCheck className="text-primaryBlue mt-1" size={18} />
                    <p className="font-medium">
                      {feature.highlight}{" "}
                      <span className="font-normal text-TextSecondary">
                        {feature.text}
                      </span>
                    </p>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stepsOrder.map((key, idx) => (
          <button
            key={key}
            onClick={() => setActiveStep(idx + 1)}
            className={`flex flex-col border-t-4 p-4 text-start ${
              activeStep === idx + 1
                ? "border-primaryBlue bg-blue-50/40"
                : "border-gray-200 bg-white hover:border-primaryBlue"
            }`}
          >
            <h4 className="text-lg font-semibold">0{idx + 1}</h4>
            <p
              className={`mt-1 font-semibold ${
                activeStep === idx + 1
                  ? "text-primaryBlue"
                  : "text-TextPrimary"
              }`}
            >
              {t(`steps.${key}.title`)}
            </p>
            <p className="text-TextSecondary mt-2 text-sm line-clamp-3">
              {t(`steps.${key}.description`)}
            </p>
          </button>
        ))}
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
