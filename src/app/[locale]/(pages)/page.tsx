"use client";

import HeroSection from "@/components/sections/HeroSection";
import AdventagesSection from "@/components/sections/AdvantagesSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import UpgradeCvSection from "@/components/sections/UpgradeCvSection";
import ImproveLinkedinSection from "@/components/sections/ImproveLinkedinSection";
import CtaSection from "@/components/sections/CtaSection";
import JobMatchSection from "@/components/sections/JobMatchSection";
import ArticlesAndVideoSection from "@/components/sections/ArticlesAndVideoSection";
import LinkedinImproveSection from "@/components/sections/LinkedinImproveSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AdventagesSection />
      <HowItWorksSection />
      <UpgradeCvSection />
      <ArticlesAndVideoSection />
      {/* <CvUpgradeSection /> */}
      {/* <ImproveLinkedinSection /> */}
      <LinkedinImproveSection />
      <CtaSection />
      {/* <JobMatchSection /> */}
    </main>
  );
}
