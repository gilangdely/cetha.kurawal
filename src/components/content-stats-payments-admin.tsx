"use client";

import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ContentPaymentsAdminProps {
  totalPending: number;
  totalVerified: number;
  totalRejected: number;
}

export default function ContentPaymentsAdmin({
  totalPending,
  totalVerified,
  totalRejected,
}: ContentPaymentsAdminProps) {
  const t = useTranslations("adminPayments.stats");

  const stats = [
    {
      label: t("pending.label"),
      sublabel: t("pending.sublabel"),
      value: totalPending,
      icon: Clock3,
      text: "text-amber-600",
      bg: "bg-amber-50/60",
    },
    {
      label: t("verified.label"),
      sublabel: t("verified.sublabel"),
      value: totalVerified,
      icon: CheckCircle2,
      text: "text-emerald-600",
      bg: "bg-emerald-50/60",
    },
    {
      label: t("rejected.label"),
      sublabel: t("rejected.sublabel"),
      value: totalRejected,
      icon: XCircle,
      text: "text-rose-600",
      bg: "bg-rose-50/60",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group relative flex items-center gap-6 overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:border-slate-400"
        >
          <div
            className={cn(
              "flex size-16 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              s.bg,
            )}
          >
            <s.icon size={28} strokeWidth={1.5} className={s.text} />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
                {s.sublabel}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold tracking-tight text-slate-900">
                {s.value}
              </h3>
              <p className="text-sm font-semibold text-slate-500">{s.label}</p>
            </div>
          </div>

          <div className="absolute top-1/2 right-6 -translate-y-1/2 opacity-[0.03] grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.08]">
            <s.icon size={80} strokeWidth={1} />
          </div>
        </div>
      ))}
    </div>
  );
}
