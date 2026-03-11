import React from "react";
import { Check, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function AdsDashboardImproveLinkedin() {
  return (
    <div className="flex h-full flex-col items-stretch gap-6 py-1 md:flex-row">
      {/* Left: Text */}
      <div className="flex flex-1 flex-col justify-between space-y-2.5">
        <div>
          <h2 className="text-TextPrimary text-2xl font-bold md:text-3xl">
            Optimize Your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
              LinkedIn
            </span>
          </h2>

          <p className="text-TextSecondary text-xs leading-relaxed md:text-sm">
            Transform your LinkedIn profile into a recruiter magnet. Our AI
            rewrites your headline, about section, and experience for maximum
            impact.
          </p>

          <ul className="text-TextSecondary mt-2.5 space-y-2 text-xs md:text-sm">
            {[
              "Headline & About rewrite",
              "Keywords optimization",
              "Recruiter-ready analysis",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/15 text-[10px] font-semibold text-blue-500">
                  <Check size={14} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href={"/dashboard/linkedin-optimizer"}
          className="group mt-6 flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110"
        >
          Optimize Profile
          <ArrowRight
            size={16}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
          />
        </Link>
      </div>

      {/* Right: Mock Profile Card */}
      <div className="flex w-full max-w-2xs flex-1 flex-col">
        <div className="border-primaryBlue/10 relative flex-1 rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
          {/* subtle glow */}
          <div className="pointer-events-none absolute -top-6 -right-6 h-16 w-16 rounded-full bg-blue-500/10 blur-xl" />

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white shadow-sm">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-TextPrimary truncate text-xs font-bold">
                Alex Smith
              </p>
              <p className="truncate text-[10px] font-medium text-blue-500">
                Product Designer
              </p>
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-[10px]">
              <span className="text-TextSecondary font-medium">
                Profile Strength
              </span>
              <span className="font-bold text-blue-500">All-Star ⭐</span>
            </div>
            <div className="bg-Background h-1.5 w-full overflow-hidden rounded-full">
              <div className="h-1.5 w-[92%] rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-700" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-blue-500/10 bg-blue-50 p-2 text-center">
              <p className="text-sm font-bold text-blue-500">2.4k</p>
              <p className="text-TextSecondary text-[9px] leading-tight">
                Views
              </p>
            </div>
            <div className="rounded-lg border border-blue-500/10 bg-blue-50 p-2 text-center">
              <p className="text-sm font-bold text-blue-500">138</p>
              <p className="text-TextSecondary text-[9px] leading-tight">
                Search
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2">
            <TrendingUp size={12} className="text-blue-500" />
            <span className="text-TextSecondary text-[10px] font-medium">
              +12% Visibility this week
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
