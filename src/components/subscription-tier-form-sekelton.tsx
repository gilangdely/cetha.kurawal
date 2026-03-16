import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionTierFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-border/60 space-y-2 border-b pb-5">
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info Card */}
          <div className="border-border/60 rounded-2xl border shadow-sm">
            <div className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <Skeleton className="h-5 w-40" />
            </div>

            <div className="space-y-6 px-6 pt-5 pb-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="border-border/60 rounded-2xl border shadow-sm">
            <div className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="space-y-4 px-6 pt-5 pb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 flex-1 rounded-md" />
                  <Skeleton className="h-10 w-10 rounded-md" />
                </div>
              ))}

              <Skeleton className="mt-2 h-9 w-36 rounded-md" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="border-border/60 rounded-2xl border shadow-sm">
            <div className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <Skeleton className="h-5 w-28" />
            </div>

            <div className="space-y-5 px-6 pt-5 pb-6">
              <div className="border-border/60 flex items-center justify-between rounded-xl border px-4 py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>

              <div className="border-border/60 flex items-center justify-between rounded-xl border px-4 py-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-6 w-10 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </div>

          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
