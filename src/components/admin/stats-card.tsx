// components/admin/stats-card.tsx
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
  title,
  value,
  hint,
  icon: Icon,
  color = "blue",
  isLoading = false,
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  color?: "blue" | "green" | "amber" | "slate";
  isLoading?: boolean;
}) {
  const colorConfig = {
    blue: {
      icon: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "hover:border-blue-400/50",
      dot: "bg-blue-500",
      gradient: "from-blue-500/5 via-transparent to-transparent",
    },
    green: {
      icon: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "hover:border-emerald-400/50",
      dot: "bg-emerald-500",
      gradient: "from-emerald-500/5 via-transparent to-transparent",
    },
    amber: {
      icon: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "hover:border-amber-400/50",
      dot: "bg-amber-500",
      gradient: "from-amber-500/5 via-transparent to-transparent",
    },
    slate: {
      icon: "text-slate-500",
      bg: "bg-slate-500/10",
      border: "hover:border-slate-400/50",
      dot: "bg-slate-500",
      gradient: "from-slate-500/5 via-transparent to-transparent",
    },
  };

  const config = colorConfig[color];

  return (
    <Card
      className={cn(
        "group border-muted/60 relative overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        config.border,
      )}
    >
      {/* Dynamic Background Pattern */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-100",
          config.gradient,
        )}
      />

      <CardContent className="relative z-10 p-7">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="bg-muted h-4 w-20 animate-pulse rounded-full" />
              <div className="bg-muted size-10 animate-pulse rounded-2xl" />
            </div>
            <div className="bg-muted h-10 w-32 animate-pulse rounded-xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground/80 text-[11px] font-bold tracking-[0.15em] uppercase">
                    {title}
                  </p>
                </div>
                <h3 className="text-foreground text-3xl font-black tracking-tight">
                  {value}
                </h3>
              </div>

              {Icon && (
                <div
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-[1.25rem] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[10deg]",
                    config.bg,
                  )}
                >
                  <Icon
                    className={cn("size-6", config.icon)}
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </div>

            {hint && (
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground/70 text-xs font-medium">
                  {hint}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
