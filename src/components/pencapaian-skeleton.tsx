import { Skeleton } from "@/components/ui/skeleton";

export function PencapaianSkeleton() {
  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>

      {/* List Skeleton */}
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* icon */}
                <Skeleton className="h-9 w-9 rounded-lg" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>

              <Skeleton className="h-6 w-10 rounded-full" />
            </div>

            {/* progress bar */}
            <Skeleton className="mt-3 h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
