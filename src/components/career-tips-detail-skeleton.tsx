import { Skeleton } from "@/components/ui/skeleton";

export default function CareerTipsDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-5xl items-center px-4 py-16 pt-18 pb-14 md:px-6 lg:min-h-screen lg:pt-28">
      <article className="w-full overflow-hidden">
        <div className="px-5 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>

          <div className="space-y-5">
            <Skeleton className="h-10 w-full max-w-3xl" />
            <Skeleton className="h-10 w-4/5 max-w-2xl" />

            <div className="flex flex-wrap gap-2 pt-1">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 sm:px-8 md:px-10 md:py-6">
          <Skeleton className="mb-8 aspect-[16/8] w-full rounded-2xl" />

          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-11/12" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-10/12" />
            <Skeleton className="h-5 w-9/12" />
          </div>
        </div>
      </article>
    </div>
  );
}
