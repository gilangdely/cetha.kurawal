// app/[locale]/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { StatsCard } from "@/components/admin/stats-card";
import { TransactionDonutChart } from "@/components/admin/transaction-donut-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  CheckCircle2,
  FilePen,
  Clock,
  LayoutGrid,
  Plus,
  ArrowRight,
  TrendingUp,
  ReceiptText,
  Layers,
  BookOpen,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

function relativeTime(iso?: string) {
  if (!iso) return "-";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

const txnStatusConfig = {
  success: {
    label: "Success",
    class:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  pending: {
    label: "Pending",
    class:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
  failed: {
    label: "Failed",
    class:
      "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400",
  },
};

const pageStatusConfig = {
  published: {
    dot: "bg-green-500",
    badge:
      "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400",
  },
  draft: {
    dot: "bg-amber-400",
    badge:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
  },
};

export default function AdminDashboardPage() {
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
  const totalRevenue = transactions
    .filter((t) => t.status === "verified")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const recentTxns = transactions
    .slice()
    .sort(
      (a, b) => (b.created_at?._seconds || 0) - (a.created_at?._seconds || 0),
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      {/* ── Page Header ─────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/admin/pages/new" className="flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              New Page
            </Link>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link
              href="/admin/subscription-tiers/create"
              className="flex items-center gap-1.5"
            >
              <Wallet className="size-3.5" />
              New Plan
            </Link>
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link
              href="/admin/contents/new-contents"
              className="flex items-center gap-1.5"
            >
              <FileText className="size-3.5" />
              New Content
            </Link>
          </Button>
        </div>
      </div>
      {/* Content Stats */}
      <div className="grid gap-4 rounded-2xl bg-gradient-to-br from-blue-300 to-white p-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatIDR(totalRevenue)}
          hint="Dari transaksi terverifikasi"
          icon={TrendingUp}
          color="green"
          isLoading={loading}
        />
        <StatsCard
          title="Total Konten"
          value={contents.length}
          hint="Artikel dan video"
          icon={FileText}
          color="blue"
          isLoading={loading}
        />
        <StatsCard
          title="Published"
          value={contents.filter((c) => c.status === "published").length}
          hint="Live di website"
          icon={CheckCircle2}
          color="green"
          isLoading={loading}
        />
        <StatsCard
          title="Tier Aktif"
          value={subscriptionTiers.filter((t) => t.is_active).length}
          hint="Paket yang sedang aktif"
          icon={CheckCircle2}
          color="green"
          isLoading={loading}
        />
      </div>

      <section className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Donut Chart */}
          <div>
            <TransactionDonutChart
              success={totalVerified}
              pending={totalPending}
              failed={totalFailed}
              isLoading={loading}
            />
          </div>

          {/* Recent Transactions List */}
          <div className="">
            <Card className="border-border/60 h-full">
              <CardHeader className="pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Transaksi Terbaru</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                  >
                    <Link
                      href="/admin/subscriptions"
                      className="flex items-center gap-1"
                    >
                      See all <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="space-y-2 p-6">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="bg-muted h-12 animate-pulse rounded"
                        />
                      ))}
                  </div>
                ) : recentTxns.length === 0 ? (
                  <div className="text-muted-foreground flex h-32 items-center justify-center text-xs">
                    Tidak ada transaksi
                  </div>
                ) : (
                  <ul className="divide-y">
                    {recentTxns.map((t) => {
                      const statusMap: Record<
                        string,
                        typeof txnStatusConfig.success
                      > = {
                        verified: txnStatusConfig.success,
                        pending: txnStatusConfig.pending,
                        rejected: txnStatusConfig.failed,
                      };
                      const cfg = statusMap[t.status] || statusMap.pending;
                      const formatDate = (seconds?: number) => {
                        if (!seconds) return "-";
                        const date = new Date(seconds * 1000);
                        const diffMs = Date.now() - date.getTime();
                        const mins = Math.floor(diffMs / 60000);
                        if (mins < 1) return "Just now";
                        if (mins < 60) return `${mins}m ago`;
                        const hrs = Math.floor(mins / 60);
                        if (hrs < 24) return `${hrs}h ago`;
                        return `${Math.floor(hrs / 24)}d ago`;
                      };
                      return (
                        <li
                          key={t.id}
                          className="hover:bg-muted/40 flex items-center justify-between gap-3 px-6 py-3 transition-colors"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {t.user?.displayName || "User"}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {formatDate(t.created_at?._seconds)}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <span className="text-sm font-semibold tabular-nums">
                              {formatIDR(t.amount || 0)}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn("text-xs", cfg.class)}
                            >
                              {t.status === "verified"
                                ? "Verified"
                                : t.status === "pending"
                                  ? "Pending"
                                  : "Rejected"}
                            </Badge>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Last Content with Thumbnail */}
          <div className="">
            <Card className="border-border/60 h-full overflow-hidden">
              <CardHeader className="pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Konten Terbaru</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700"
                  >
                    <Link
                      href="/admin/contents"
                      className="flex items-center gap-1"
                    >
                      See all <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="flex gap-4 p-6">
                    <div className="bg-muted h-32 w-32 flex-shrink-0 animate-pulse rounded-lg" />
                    <div className="flex-1 space-y-3">
                      <div className="bg-muted h-4 w-48 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-32 animate-pulse rounded" />
                      <div className="bg-muted h-3 w-40 animate-pulse rounded" />
                    </div>
                  </div>
                ) : contents.length === 0 ? (
                  <div className="text-muted-foreground flex h-40 items-center justify-center text-xs">
                    Belum ada konten
                  </div>
                ) : (
                  <div className="divide-y">
                    {contents.slice(0, 1).map((item) => {
                      const formatDate = (seconds?: number) => {
                        if (!seconds) return "-";
                        const date = new Date(seconds * 1000);
                        const diffMs = Date.now() - date.getTime();
                        const mins = Math.floor(diffMs / 60000);
                        if (mins < 1) return "Just now";
                        if (mins < 60) return `${mins}m ago`;
                        const hrs = Math.floor(mins / 60);
                        if (hrs < 24) return `${hrs}h ago`;
                        return `${Math.floor(hrs / 24)}d ago`;
                      };

                      const typeColor =
                        item.type === "article"
                          ? "text-violet-700"
                          : "text-rose-700";
                      const typeBg =
                        item.type === "article" ? "bg-violet-50" : "bg-rose-50";
                      const statusColor =
                        item.status === "published"
                          ? "text-emerald-700"
                          : "text-amber-700";
                      const statusBg =
                        item.status === "published"
                          ? "bg-emerald-50"
                          : "bg-amber-50";

                      return (
                        <div
                          key={item.id}
                          className="hover:bg-muted/40 flex flex-col gap-4 p-4 transition-colors"
                        >
                          {/* Thumbnail */}
                          <div className="border-border/60 bg-muted relative h-32 w-full flex-shrink-0 overflow-hidden rounded-lg border">
                            {item.coverImageUrl ? (
                              <Image
                                src={item.coverImageUrl}
                                alt={item.title}
                                fill
                                className="object-cover"
                                sizes="132px"
                                unoptimized
                              />
                            ) : (
                              <div className="bg-muted flex h-full w-full items-center justify-center">
                                <FileText className="text-muted-foreground h-6 w-6" />
                              </div>
                            )}
                          </div>

                          {/* Content Info */}
                          <div className="flex min-w-0 flex-1 justify-between">
                            <div>
                              <h3 className="line-clamp-2 text-sm font-semibold">
                                {item.title}
                              </h3>
                              <div className="mt-2 flex justify-between gap-2">
                                <div className="flex gap-2">
                                  <Badge
                                    variant="outline"
                                    className={cn("text-xs", typeBg, typeColor)}
                                  >
                                    {item.type === "article"
                                      ? "Artikel"
                                      : "Video"}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      statusBg,
                                      statusColor,
                                    )}
                                  >
                                    {item.status === "published"
                                      ? "Published"
                                      : "Draft"}
                                  </Badge>
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  {formatDate(item.createdAt?._seconds)}
                                </div>
                              </div>
                              <p className="mt-2 mb-4 line-clamp-2 flex-1 text-sm text-gray-600">
                                {item.excerpt}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
