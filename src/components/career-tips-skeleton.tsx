import { Skeleton } from "@/components/ui/skeleton";

export function CareerTipsSkeleton({ count = 6 }: { count?: number }) {
  const cards = Array.from({ length: count });

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Thumbnail */}
          <Skeleton className="aspect-[16/9] w-full rounded-t-2xl" />

          {/* Content */}
          <div className="flex flex-1 flex-col p-5">
            {/* Badge + tags */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-16 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-12 rounded-md" />
            </div>

            {/* Title */}
            <Skeleton className="mb-2 h-6 w-3/4 rounded-md" />

            {/* Excerpt */}
            <Skeleton className="mb-4 h-4 w-full rounded-md" />
            <Skeleton className="mb-4 h-4 w-5/6 rounded-md" />

            {/* CTA */}
            <Skeleton className="mt-auto h-5 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
