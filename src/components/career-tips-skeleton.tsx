import { Skeleton } from "@/components/ui/skeleton";

export function CareerTipsSkeleton({ count = 6 }: { count?: number }) {
  const cards = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((_, idx) => (
        <div
          key={idx}
          className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
            <Skeleton className="h-full w-full rounded-none" />
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-6 w-14 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>

            <div className="mb-2 space-y-2">
              <Skeleton className="h-6 w-11/12 rounded-md" />
              <Skeleton className="h-6 w-8/12 rounded-md" />
            </div>

            <div className="mb-4 flex-1 space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-10/12 rounded-md" />
            </div>

            <div className="mt-auto inline-flex w-fit items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
