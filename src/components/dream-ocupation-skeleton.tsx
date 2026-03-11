import { Skeleton } from "@/components/ui/skeleton";

export function DreamOccupationSkeleton() {
  return (
    <div className="bg-primaryBlue relative flex flex-col justify-between rounded-3xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {/* icon skeleton */}
          <Skeleton className="h-12 w-12 rounded-xl bg-white/20" />

          <div className="space-y-2">
            <Skeleton className="h-3 w-24 bg-white/20" />
            <Skeleton className="h-6 w-32 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
