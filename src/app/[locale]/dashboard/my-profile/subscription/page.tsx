"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubscriptionTier } from "@/types/subscription";
import { PricingCardSkeleton } from "@/components/pricing-card-skeleton";

export default function Page() {
  const router = useRouter();

  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTiers = async () => {
      try {
        const res = await fetch("/api/subscription-tiers");

        if (res.ok) {
          const json = await res.json();
          setTiers(json.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch tiers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubscribe = (slug: string) => {
    router.push(`/id/pricing/${slug}/checkout`);
  };

  return (
    <div className="mt-10">
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PricingCardSkeleton key={i} />
          ))}
        </div>
      ) : tiers.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-gray-500">
            Belum ada paket langganan yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tiers.map((plan, i) => {
            const hasRecommended = tiers.some((t) => t.is_recommended);

            const isFeatured = hasRecommended
              ? plan.is_recommended
              : i === 1 ||
                (plan.price === Math.max(...tiers.map((t) => t.price)) &&
                  tiers.length > 1 &&
                  i !== tiers.length - 1);

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                className={`relative flex flex-col rounded-xl border px-5 py-6 shadow-sm transition ${
                  isFeatured
                    ? "border-[#2563eb] bg-[#2563eb] text-white"
                    : "border-slate-200 bg-white text-gray-800"
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold shadow">
                    Paling Direkomendasikan
                  </div>
                )}

                <div className="mb-3">
                  <h3 className="mb-1 text-lg font-bold">{plan.name}</h3>
                  <p className="text-xs opacity-90">
                    {plan.description || "Tingkatkan benefit kamu."}
                  </p>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold">
                      {formatRupiah(plan.price)}
                    </span>
                    <span className="text-xs opacity-80">
                      • +{plan.quota_amount} Kuota
                    </span>
                  </div>
                </div>

                <ul className="mb-6 flex flex-1 flex-col gap-2 text-xs">
                  {plan.features?.map((f: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle
                        size={14}
                        className={isFeatured ? "text-white" : "text-[#2563eb]"}
                      />
                      <span
                        className={isFeatured ? "text-white" : "text-gray-700"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSubscribe(plan.slug)}
                  className={`w-full rounded-lg py-2.5 text-sm font-medium transition ${
                    isFeatured
                      ? "bg-white text-[#2563eb] hover:bg-blue-50"
                      : "bg-[#2563eb] text-white hover:bg-blue-600"
                  }`}
                >
                  Berlangganan
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
