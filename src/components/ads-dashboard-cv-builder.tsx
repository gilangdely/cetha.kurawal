import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AdsDashboardCvBuilder() {
  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Build a{" "}
            <span className="bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">
              Job-Winning CV
            </span>{" "}
            in Minutes
          </h2>

          <p className="mt-1 text-sm leading-relaxed text-gray-600 md:text-base">
            Use our smart templates and AI-guided prompts to craft a
            professional CV tailored to the role you want — no design skills
            needed.
          </p>

          <div className="mt-2 mb-3 flex flex-wrap gap-3">
            {["50+ Templates", "AI-Powered", "PDF Export"].map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-violet-300/50 bg-violet-100/30 px-3 py-1 text-xs font-medium text-violet-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={"/dashboard/cv-builder"}
          className="group mt-3 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all duration-300 hover:shadow-violet-500/40 hover:brightness-110"
        >
          Start Building
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock Template Picker */}
      <div className="flex w-full max-w-xs flex-1 flex-col">
        <div className="border-primaryBlue/10 relative flex-1 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          {/* subtle glow */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-20 w-20 rounded-full bg-violet-100/40 blur-2xl" />

          <p className="mb-3 text-[11px] font-semibold tracking-widest text-gray-500 uppercase">
            Choose Template
          </p>

          <div className="mb-4 grid grid-cols-2 gap-2">
            {["Modern", "Classic", "Creative", "Bold"].map((t, i) => (
              <div
                key={t}
                className={`cursor-pointer rounded-lg border p-2 text-center text-xs transition-all duration-200 ${
                  i === 0
                    ? "border-violet-400 bg-violet-200/40 text-violet-700 shadow-sm shadow-violet-200"
                    : "border-gray-200/50 bg-gray-50/50 text-gray-500 hover:border-gray-300 hover:bg-gray-100"
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          <div className="space-y-2 rounded-xl border border-gray-200/50 bg-gray-50/50 p-3">
            <div className="h-2 w-24 rounded bg-violet-300/50" />
            <div className="h-1.5 w-full rounded bg-gray-200/50" />
            <div className="h-1.5 w-3/4 rounded bg-gray-200/50" />
            <div className="h-1.5 w-5/6 rounded bg-gray-200/50" />
          </div>
        </div>
      </div>
    </div>
  );
}
