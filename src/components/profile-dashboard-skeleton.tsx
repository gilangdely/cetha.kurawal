import { Skeleton } from "@/components/ui/skeleton";

export function ProfileDashboardSkeleton() {
  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
      {/* Accent */}
      <div className="bg-primaryBlue/30 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-2 inline-block">
          <Skeleton className="h-22 w-22 rounded-full" />
        </div>

        {/* Username */}
        <Skeleton className="mt-2 h-6 w-32 rounded-md" />

        {/* Email */}
        <Skeleton className="mt-2 h-4 w-44 rounded-md" />

        {/* Edit button */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      {/* ROLE */}
      <div className="z-10 mt-4 w-full border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-xl" />
          <Skeleton className="h-6 w-20 rounded-xl" />
          <Skeleton className="h-6 w-14 rounded-xl" />
        </div>
      </div>

      {/* SKILLS */}
      <div className="z-10 mt-4 w-full">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-20 rounded-xl" />
          <Skeleton className="h-6 w-16 rounded-xl" />
          <Skeleton className="h-6 w-24 rounded-xl" />
          <Skeleton className="h-6 w-18 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
