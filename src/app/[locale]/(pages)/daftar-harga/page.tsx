"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { SubscriptionTier } from "@/types/subscription";
import { useRouter } from "next/navigation";

export default function PricingByQuota() {
  const t = useTranslations("pricingQuota");
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
      } catch (error) {
        console.error("Failed to fetch subscription tiers:", error);
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
    router.push(`/id/daftar-harga/${slug}/checkout`);
  };

  // Fallback to static QuotaList if DB is empty, or just show loading/empty state.
  // For now, we only show dynamic data from the DB.

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto max-w-7xl px-4 py-16 pt-28 min-h-[80vh]"
    >
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mb-8 text-center"
      >
        <div className="border-primaryBlue mx-auto w-fit rounded-full border-2 px-2 py-1 lg:px-3 lg:py-1.5">
          <p className="text-primaryBlue lg:font-medium">{t("badge")}</p>
        </div>
        <div className="mx-auto mt-4 max-w-3xl flex-col text-center">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-4xl lg:text-3xl">
            {t("title")}
          </h2>
          <p className="text-TextSecondary mt-2 text-base lg:text-lg">
            {t("description")}
          </p>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primaryBlue" size={40} />
          <span className="ml-3 text-lg font-medium text-gray-600">Memuat paket langganan...</span>
        </div>
      ) : tiers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Belum ada paket langganan yang tersedia saat ini.</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {tiers.map((plan, i) => {
            // Gunakan is_recommended dari database, fallback ke perhitungan lama jika tidak ada sama sekali.
            const hasRecommended = tiers.some(t => t.is_recommended);
            const isFeatured = hasRecommended
              ? plan.is_recommended
              : (i === 1 || plan.price === Math.max(...tiers.map(t => t.price)) && tiers.length > 1 && i !== tiers.length - 1);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm relative flex h-full flex-col rounded-2xl border px-6 py-8 shadow-md transition-all duration-300 ${isFeatured
                  ? "border-[#2563eb] bg-[#2563eb] text-white"
                  : "border-slate-200 bg-white text-gray-800"
                  }`}
              >
                {isFeatured && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold shadow flex items-center gap-1.5"
                  >
                    ⭐ Paling Direkomendasikan
                  </motion.div>
                )}
                <div className="mb-4">
                  <h3 className="mb-1 text-xl font-bold">{plan.name}</h3>
                  <p className="text-sm opacity-90">{plan.description || "Tingkatkan benefit kamu."}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold">{formatRupiah(plan.price)}</span>
                    <span className="text-sm opacity-80">• +{plan.quota_amount} Kuota</span>
                  </div>
                </div>

                <ul className="mb-8 flex flex-1 flex-col gap-2 text-sm">
                  {plan.features?.map((f: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle
                        className={isFeatured ? "text-white" : "text-[#2563eb]"}
                        size={15}
                      />
                      <span
                        className={isFeatured ? "text-white" : "text-gray-700"}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubscribe(plan.slug)}
                  className={`w-full rounded-lg py-3 text-base font-medium transition-all duration-200 ${isFeatured
                    ? "bg-white text-[#2563eb] hover:bg-blue-50"
                    : "bg-[#2563eb] text-white hover:bg-blue-600"
                    }`}
                >
                  Berlangganan Sekarang
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.section>
  );
}
