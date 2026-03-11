import { Skeleton } from "@/components/ui/skeleton";

export default function ArticlesAndVideoSkeleton() {
  return (
    <div className="mt-10 flex flex-col gap-8 md:flex-row md:gap-8">
      {/* VIDEO SKELETON */}
      <div className="w-full md:flex-1">
        <div className="space-y-4 p-1">
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-32 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Divider Mobile */}
      <div className="block h-px w-full bg-gray-200 md:hidden" />

      {/* ARTICLES SKELETON */}
      <div className="w-full space-y-4 md:flex-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-4 rounded-2xl bg-white p-4 md:flex-row md:p-2"
          >
            <Skeleton className="h-40 w-full flex-shrink-0 rounded-xl md:h-32 md:w-48" />

            <div className="flex flex-1 flex-col justify-between space-y-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
              </div>
            </div>
          </div>
        ))}

        {/* CTA SKELETON */}
        <Skeleton className="mt-4 h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
