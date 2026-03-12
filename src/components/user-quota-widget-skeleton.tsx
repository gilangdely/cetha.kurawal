import { Skeleton } from "@/components/ui/skeleton";

export function UserQuotaWidgetSkeleton() {
  return (
    <div className="bg-primaryBlue border-primaryBlue/20 relative flex flex-col justify-between rounded-3xl border p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* Icon skeleton */}
          <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />

          <div className="space-y-2">
            {/* Label */}
            <Skeleton className="h-3 w-20 bg-white/20" />

            {/* Quota */}
            <Skeleton className="h-6 w-28 bg-white/20" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="h-8 w-8 rounded-full bg-white/20" />
      </div>
    </div>
  );
}
