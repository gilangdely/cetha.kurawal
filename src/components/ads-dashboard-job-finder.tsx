import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AdsDashboardJobFinder() {
  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-2.5">
        <div>
          <h2 className="text-TextPrimary text-2xl leading-tight font-bold md:text-3xl">
            Find Jobs That{" "}
            <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent">
              Match You
            </span>
          </h2>
          <p className="text-TextSecondary text-xs leading-relaxed md:text-sm">
            We provide personalized job recommendations tailored to your unique
            skills, experience, and interests, helping you discover the best
            opportunities that match your career goals. Our listings are updated
            daily from trusted sources to ensure you never miss a relevant
            opening.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {["Remote-friendly", "Salary filters", "Daily alerts"].map(
              (tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-red-500/10 bg-red-50 px-3 py-1 text-xs font-medium text-red-500"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>

        <Link
          href="/dashboard/job-match"
          className="group mt-3 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-red-400 to-red-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:shadow-red-500/40 hover:brightness-110"
        >
          Find Jobs
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock Job Cards */}
      <div className="flex w-full max-w-2xs flex-1 flex-col">
        <div className="relative flex flex-1 flex-col rounded-xl border border-red-500/10 bg-white p-4 shadow-sm transition hover:shadow-md">
          {/* subtle gradient accent */}
          <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-red-500/10 blur-xl" />

          {[
            {
              role: "Product Designer",
              company: "Figma",
              salary: "$120k-$150k",
              match: 98,
            },
            {
              role: "UX Researcher",
              company: "Notion",
              salary: "$95k-$120k",
              match: 91,
            },
            {
              role: "Design Lead",
              company: "Linear",
              salary: "$140k-$170k",
              match: 87,
            },
          ].map((job) => (
            <div
              key={job.role}
              className="mb-3 flex items-center justify-between rounded-lg border border-red-500/10 bg-red-50 px-4 py-3"
            >
              <div>
                <p className="text-TextPrimary text-sm font-semibold">
                  {job.role}
                </p>
                <p className="text-TextSecondary text-xs">
                  {job.company} · {job.salary}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-red-500">
                  {job.match}%
                </span>
                <div className="mt-1 h-1.5 w-16 overflow-hidden rounded-full bg-red-100">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                    style={{ width: `${job.match}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
