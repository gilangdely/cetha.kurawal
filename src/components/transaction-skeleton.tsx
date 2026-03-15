import { Skeleton } from "@/components/ui/skeleton";

export default function TransactionsSkeleton() {
  return (
    <div className="mx-auto w-full space-y-8">
      {/* HEADER */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <Skeleton className="h-11 w-36 rounded-2xl" />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl border border-slate-200/70 bg-white p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE DESKTOP */}
      <div className="overflow-hidden rounded-sm border border-slate-200/70 bg-white">
        <div className="hidden md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                {[...Array(5)].map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <Skeleton className="h-3 w-20" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-36" />
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>

                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Skeleton className="ml-auto h-8 w-20 rounded-xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE LIST */}
        <div className="grid gap-3 p-4 md:hidden">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
