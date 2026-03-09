import { Skeleton } from "@/components/ui/skeleton";

export function CheckoutSkeleton() {
  return (
    <div className="flex min-h-screen w-full lg:h-screen lg:overflow-hidden">
      {/* LEFT PANEL */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 lg:flex">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10">
          {/* back button */}
          <Skeleton className="h-6 w-40 bg-white/20" />

          {/* pricing card */}
          <div className="absolute top-30 right-14 w-[360px] space-y-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-white/30" />
              <Skeleton className="h-8 w-40 bg-white/40" />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3">
              <Skeleton className="h-10 w-10 rounded-lg bg-white/30" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-white/40" />
                <Skeleton className="h-3 w-32 bg-white/30" />
              </div>
            </div>

            <Skeleton className="h-3 w-56 bg-white/30" />

            <div className="h-px bg-white/20" />

            <div className="space-y-2">
              <Skeleton className="h-3 w-full bg-white/30" />
              <Skeleton className="h-4 w-full bg-white/40" />
            </div>

            <Skeleton className="h-3 w-48 bg-white/30" />
          </div>

          <Skeleton className="h-3 w-56 bg-white/30" />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-[1.2] items-center justify-center px-4 py-6">
        <div className="flex w-full flex-col gap-6 rounded-3xl p-6 md:max-w-xl">
          {/* header */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* payment methods */}
          <div className="space-y-3">
            <Skeleton className="h-3 w-40" />

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-11 rounded-xl" />
              ))}
            </div>
          </div>

          {/* payment card */}
          <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5">
            <div className="space-y-2 text-center">
              <Skeleton className="mx-auto h-3 w-24" />
              <Skeleton className="mx-auto h-8 w-40" />
            </div>

            <div className="space-y-3 border-t pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>

          {/* upload area */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>

          {/* button */}
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
