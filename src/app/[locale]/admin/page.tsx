"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { TransactionDonutChart } from "@/components/admin/transaction-donut-chart";
import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ContentStatsAdmin from "@/components/content-stats-admin";
import { ChartTransactionTrend } from "@/components/admin/chart-transaction-trend";
import { LastContentAdmin } from "@/components/admin/last-content-admin";
import { RecentTransactionsAdmin } from "@/components/admin/recent-transactions-admin";

export default function AdminDashboardPage() {
  const t = useTranslations("adminDashboard");
  const locale = useLocale();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [contents, setContents] = useState<any[]>([]);
  const [subscriptionTiers, setSubscriptionTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load subscription transactions
        const txnRes = await fetch("/api/admin/subscriptions");
        if (txnRes.ok) {
          const txnData = await txnRes.json();
          setTransactions(txnData.data || []);
        }

        // Load contents
        const contentsRes = await fetch("/api/admin/contents");
        if (contentsRes.ok) {
          const contentsData = await contentsRes.json();
          setContents(contentsData.data || []);
        }

        // Load subscription tiers
        const tiersRes = await fetch("/api/admin/subscription-tiers");
        if (tiersRes.ok) {
          const tiersData = await tiersRes.json();
          setSubscriptionTiers(tiersData.data || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats from real data
  const totalVerified = transactions.filter(
    (t) => t.status === "verified",
  ).length;
  const totalPending = transactions.filter(
    (t) => t.status === "pending",
  ).length;
  const totalFailed = transactions.filter(
    (t) => t.status === "rejected",
  ).length;

  // Monthly revenue calculation (last 4 months)
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long" });
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 4 }, (_, i) => {
    const monthIdx = (now.getMonth() - (3 - i) + 12) % 12;
    const year =
      monthIdx > now.getMonth() ? now.getFullYear() - 1 : now.getFullYear();
    const monthStart = new Date(year, monthIdx, 1);
    const monthEnd = new Date(year, monthIdx + 1, 1);
    const revenue = transactions
      .filter((t) => t.status === "verified" && t.created_at?._seconds)
      .filter((t) => {
        const ts = t.created_at._seconds * 1000;
        return ts >= monthStart.getTime() && ts < monthEnd.getTime();
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return {
      month: monthFormatter.format(monthStart),
      revenue,
    };
  });

  return (
    <main className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="ml-auto flex shrink-0 gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/admin/pages/new" className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {t("actions.newPage")}
            </Link>
          </Button>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link
              href="/admin/subscription-tiers/create"
              className="flex items-center gap-1.5"
            >
              <Wallet className="size-3.5" />
              {t("actions.newPlan")}
            </Link>
          </Button>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link
              href="/admin/contents/new-contents"
              className="flex items-center gap-1.5"
            >
              <FileText className="size-3.5" />
              {t("actions.newContent")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Content Stats */}
      <ContentStatsAdmin
        transactions={transactions}
        contents={contents}
        subscriptionTiers={subscriptionTiers}
        loading={loading}
      />

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Donut Chart */}
          <div className="h-full lg:col-span-1">
            <TransactionDonutChart
              success={totalVerified}
              pending={totalPending}
              failed={totalFailed}
              isLoading={loading}
            />
          </div>

          <div className="h-full lg:col-span-1">
            <ChartTransactionTrend monthlyRevenue={monthlyRevenue} />
          </div>

          {/* Last Content */}
          <div>
            <LastContentAdmin contents={contents} loading={loading} />
          </div>

          {/* Recent Transactions */}
          <div className="h-full lg:col-span-3">
            <RecentTransactionsAdmin
              transactions={transactions}
              loading={loading}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
