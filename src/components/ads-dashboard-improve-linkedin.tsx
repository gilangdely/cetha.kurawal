import React from "react";

export default function AdsDashboardImproveLinkedin() {
  return (
    <div className="flex flex-col items-center gap-8 py-2 md:flex-row">
      {/* Left: Text */}
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl leading-tight font-bold text-white md:text-4xl">
          Get Noticed on{" "}
          <span className="bg-gradient-to-r from-sky-400 to-blue-300 bg-clip-text text-transparent">
            LinkedIn
          </span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Transform your LinkedIn profile into a recruiter magnet. Our AI
          rewrites your headline, about section, and experience for maximum
          impact.
        </p>
        <ul className="space-y-2 text-sm text-slate-300">
          {[
            "Headline rewrite",
            "About section optimization",
            "Skills gap analysis",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/20 text-xs text-sky-400">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
        <button className="mt-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-all hover:scale-105 hover:shadow-sky-500/40">
          Optimize Profile →
        </button>
      </div>

      {/* Right: Mock Profile Card */}
      <div className="w-full max-w-xs flex-1 md:max-w-sm">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-blue-500 text-lg font-bold text-white">
              J
            </div>
            <div>
              <p className="text-sm font-semibold text-white">John Doe</p>
              <p className="text-xs text-sky-300">
                Senior Product Designer · Open to work
              </p>
            </div>
          </div>
          <div className="mb-3 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Profile strength</span>
              <span className="font-semibold text-sky-400">All-Star ⭐</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div className="h-1.5 w-[88%] rounded-full bg-gradient-to-r from-sky-400 to-blue-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-2">
              <p className="text-lg font-bold text-sky-300">2.4k</p>
              <p className="text-xs text-slate-400">Profile views</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-2">
              <p className="text-lg font-bold text-blue-300">138</p>
              <p className="text-xs text-slate-400">Search appearances</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
