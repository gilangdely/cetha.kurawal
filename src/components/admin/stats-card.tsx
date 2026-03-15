// components/admin/stats-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
      icon: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200/50 dark:border-blue-800/50",
      gradient:
        "from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent",
    },
    green: {
      icon: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200/50 dark:border-green-800/50",
      gradient:
        "from-green-50 to-transparent dark:from-green-950/20 dark:to-transparent",
    },
    amber: {
      icon: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200/50 dark:border-amber-800/50",
      gradient:
        "from-amber-50 to-transparent dark:from-amber-950/20 dark:to-transparent",
    },
    slate: {
      icon: "text-slate-600 dark:text-slate-400",
      bg: "bg-slate-50 dark:bg-slate-950/30",
      border: "border-slate-200/50 dark:border-slate-800/50",
      gradient:
        "from-slate-50 to-transparent dark:from-slate-950/20 dark:to-transparent",
    },
  };

  const config = colorConfig[color];

  return (
    <Card
      className={cn(
        "hover:border-opacity-100 relative overflow-hidden border transition-all duration-200 hover:shadow-md",
        config.border,
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-40",
          config.gradient,
        )}
      />

      <CardContent className="relative z-10 flex flex-col gap-4 p-6">
        {isLoading ? (
          <>
            {/* Skeleton Title */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="bg-muted h-3 w-24 animate-pulse rounded" />
              </div>
              <div
                className={cn(
                  "bg-muted flex size-6 shrink-0 animate-pulse items-center justify-center rounded-lg",
                  config.bg,
                )}
              />
            </div>

            {/* Skeleton Value */}
            <div className="flex flex-col gap-1">
              <div className="bg-muted h-8 w-32 animate-pulse rounded" />
            </div>
          </>
        ) : (
          <>
            {/* Title */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-muted-foreground truncate text-xs font-semibold tracking-wider uppercase">
                  {title}
                </p>
              </div>
              {Icon && (
                <div
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-lg",
                    config.bg,
                  )}
                >
                  <Icon className={cn("size-6", config.icon)} />
                </div>
              )}
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1">
              <div className="text-3xl font-bold tracking-tight">{value}</div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
