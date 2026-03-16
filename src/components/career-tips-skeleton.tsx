import { Skeleton } from "@/components/ui/skeleton";

export function CareerTipsSkeleton({ count = 6 }: { count?: number }) {
  const cards = Array.from({ length: count });

  return (
    <main className="mx-auto flex w-full max-w-7xl items-center px-4 py-16 pt-18 pb-14 md:px-6 lg:min-h-screen lg:pt-28">
      <section className="w-full space-y-7">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full max-w-[34rem] rounded-md" />
            <Skeleton className="h-6 w-full max-w-[28rem] rounded-md" />
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm">
              <Skeleton className="ml-2 h-8 w-8 rounded-full" />
              <Skeleton className="h-10 flex-1 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="scrollbar-hide flex w-full items-center gap-2 overflow-x-auto pb-3">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-24 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>
        </div>

        {/* Cards Skeleton */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Thumbnail */}
              <Skeleton className="aspect-[16/9] w-full" />

              <div className="flex flex-1 flex-col p-5">
                {/* Badge */}
                <Skeleton className="mb-3 h-5 w-20 rounded-full" />

                {/* Title */}
                <Skeleton className="mb-2 h-6 w-[80%]" />
                <Skeleton className="mb-3 h-6 w-[60%]" />

                {/* Excerpt */}
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="mb-4 h-4 w-[85%]" />

                {/* Link */}
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
