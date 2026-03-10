import React from "react";

export default function AdsDashboardJobFinder() {
  return (
    <div className="flex flex-col items-center gap-8 py-2 md:flex-row">
      {/* Left: Text */}
      <div className="flex-1 space-y-4">
        <h2 className="text-3xl leading-tight font-bold text-white md:text-4xl">
          Find Jobs That{" "}
          <span className="bg-gradient-to-r from-rose-400 to-orange-300 bg-clip-text text-transparent">
            Match You
          </span>
        </h2>
        <p className="text-sm leading-relaxed text-slate-400 md:text-base">
          Stop scrolling endlessly. Our AI matches your skills and preferences
          to the best opportunities — updated daily from thousands of sources.
        </p>
        <div className="flex flex-wrap gap-3">
          {["Remote-friendly", "Salary filters", "Daily alerts"].map((tag) => (
            <span
              key={tag}
              className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="mt-2 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all hover:scale-105 hover:shadow-rose-500/40">
          Find Jobs →
        </button>
      </div>

      {/* Right: Mock Job Cards */}
      <div className="w-full max-w-xs flex-1 space-y-2 md:max-w-sm">
        {[
          {
            role: "Product Designer",
            company: "Figma",
            salary: "$120k–$150k",
            match: 98,
            color: "text-rose-400",
          },
          {
            role: "UX Researcher",
            company: "Notion",
            salary: "$95k–$120k",
            match: 91,
            color: "text-orange-400",
          },
          {
            role: "Design Lead",
            company: "Linear",
            salary: "$140k–$170k",
            match: 87,
            color: "text-amber-400",
          },
        ].map((job) => (
          <div
            key={job.role}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
          >
            <div>
              <p className="text-sm font-semibold text-white">{job.role}</p>
              <p className="text-xs text-slate-400">
                {job.company} · {job.salary}
              </p>
            </div>
            <span className={`text-sm font-bold ${job.color}`}>
              {job.match}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
