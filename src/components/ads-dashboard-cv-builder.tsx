import React from "react";

export default function AdsDashboardCvBuilder() {
  return (
    <div className="flex flex-col items-center gap-8 py-2 md:flex-row">
      {/* Left: Text */}
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl leading-tight font-bold text-white md:text-4xl">
          Build a{" "}
          <span className="bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
            Job-Winning CV
          </span>{" "}
          in Minutes
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Use our smart templates and AI-guided prompts to craft a professional
          CV tailored to the role you want — no design skills needed.
        </p>
        <div className="flex flex-wrap gap-3">
          {["50+ Templates", "AI-Powered", "PDF Export"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="mt-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:scale-105 hover:shadow-violet-500/40">
          Start Building →
        </button>
      </div>

      {/* Right: Mock Template Picker */}
      <div className="w-full max-w-xs flex-1 md:max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Choose Template
          </p>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {[
              "Modern",
              "Classic",
              "Creative",
              "Minimal",
              "Bold",
              "Elegant",
            ].map((t, i) => (
              <div
                key={t}
                className={`cursor-pointer rounded-lg p-2 text-center text-xs transition-all ${
                  i === 0
                    ? "border border-violet-400 bg-violet-500/30 text-violet-200"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {t}
              </div>
            ))}
          </div>
          <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="h-2 w-24 rounded bg-violet-400/40" />
            <div className="h-1.5 w-full rounded bg-white/10" />
            <div className="h-1.5 w-3/4 rounded bg-white/10" />
            <div className="h-1.5 w-5/6 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
