import { Skeleton } from "./ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      {/* Sidebar Skeleton */}
      <div className="hidden w-64 border-r border-gray-200 bg-white lg:block">
        <div className="space-y-6 p-6">
          <Skeleton className="h-8 w-32" />

          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
          </div>

          <div className="pt-6">
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-1 flex-col">
        {/* Header Skeleton */}
        <div className="flex h-16 items-center border-b border-gray-200 bg-white px-6">
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-4 rounded-2xl bg-white p-6">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
