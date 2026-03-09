import { Skeleton } from "@/components/ui/skeleton";

export function PricingCardSkeleton() {
  return (
    <div className="flex w-full max-w-sm flex-col rounded-2xl border border-slate-200 bg-white px-6 py-8 shadow-sm">
      {/* Title */}
      <div className="mb-4">
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Price */}
      <div className="mb-6">
        <Skeleton className="h-8 w-40" />
      </div>

      {/* Features */}
      <div className="mb-8 flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[85%]" />
      </div>

      {/* Button */}
      <Skeleton className="h-11 w-full rounded-lg" />
    </div>
  );
}
