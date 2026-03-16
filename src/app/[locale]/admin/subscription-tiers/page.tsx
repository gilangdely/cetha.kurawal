"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { PlusCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { SubscriptionTier } from "@/types/subscription";
import ContentStatsSubscriptionAdmin from "@/components/content-stats-subscription-admin";
import TableSubscriptionTiersAdmin from "@/components/table-subscription-tiers-admin";

export default function AdminSubscriptionTiersPage() {
  const t = useTranslations("adminSubscriptionTiers.list");
  const locale = useLocale();

  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTiers = async () => {
    setLoading(true);
    try {
      const url = new URL(
        "/api/admin/subscription-tiers",
        window.location.origin,
      );
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setTiers(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTiers();
  }, []);

  const deleteTier = async (id: string, name: string) => {
    if (!confirm(t("deleteConfirm", { name }))) return;
    try {
      await fetch(`/api/admin/subscription-tiers/${id}`, { method: "DELETE" });
      loadTiers();
    } catch (e) {
      console.error(e);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {t("title")}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-400">
              {t("description")}
            </p>
          </div>
        </div>
        <Link
          href="/admin/subscription-tiers/create-new-subscription-tiers"
          className="bg-primaryBlue hover:bg-primaryBlueHover inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200"
        >
          <PlusCircle size={14} />
          {t("addButton")}
        </Link>
      </div>

      {/* Stats */}
      <ContentStatsSubscriptionAdmin tiers={tiers} />

      {/* Table subscription tiers */}
      <TableSubscriptionTiersAdmin
        deleteTier={deleteTier}
        formatRupiah={formatRupiah}
        loading={loading}
        tiers={tiers}
      />
    </div>
  );
}
