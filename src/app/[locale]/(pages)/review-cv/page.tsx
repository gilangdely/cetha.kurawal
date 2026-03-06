"use client";

import Link from "next/link";
import Image from "next/image";
import UploadCv from "@/components/upload-cv";
import { motion } from "framer-motion";

import { ChevronRight } from "lucide-react";

import illustration from "@/assets/img/illustration-review-cv.jpg";

export default function ReviewCVPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl items-center pt-20 lg:pt-0">
      <section className="w-full">
        {/* Hero Section */}
        <div className="flex w-full items-center py-12 lg:min-h-screen lg:py-0">
          <div className="flex w-full items-center gap-10 px-6 lg:flex-row lg:px-0">
            {/* Content Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full flex-1 lg:mt-24"
            >
              

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              >
                <UploadCv />
              </motion.div>
            </motion.div>

            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="hidden flex-1 lg:block"
            >
              <Image
                className="relative"
                draggable={false}
                src={illustration}
                alt="illustration review cv"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
