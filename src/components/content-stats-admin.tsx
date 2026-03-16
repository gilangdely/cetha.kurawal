"use client";

import { StatsCard } from "./admin/stats-card";
import { FileText, Globe, TrendingUp, Zap } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface ContentStatsAdminProps {
  transactions: any[];
  contents: any[];
  subscriptionTiers: any[];
  loading: boolean;
}

function formatIDR(amount: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ContentStatsAdmin({
  transactions,
  contents,
  subscriptionTiers,
  loading,
}: ContentStatsAdminProps) {
  const t = useTranslations("adminDashboard.contentStats");
  const locale = useLocale();

  const totalRevenue = transactions
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={t("revenue.title")}
        value={formatIDR(totalRevenue, locale)}
        hint={t("revenue.hint")}
        icon={TrendingUp}
        color="green"
        isLoading={loading}
      />
      <StatsCard
        title={t("library.title")}
        value={`${contents.length} ${t("library.items")}`}
        hint={t("library.hint")}
        icon={FileText}
        color="blue"
        isLoading={loading}
      />
      <StatsCard
        title={t("liveNow.title")}
        value={contents.filter((c) => c.status === "published").length}
        hint={t("liveNow.hint")}
        icon={Globe}
        color="blue"
        isLoading={loading}
      />
      <StatsCard
        title={t("tiers.title")}
        value={subscriptionTiers.filter((t) => t.is_active).length}
        hint={t("tiers.hint")}
        icon={Zap}
        color="amber"
        isLoading={loading}
      />
    </div>
  );
}
