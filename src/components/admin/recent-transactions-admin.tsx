"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";

interface Transaction {
  id: string;
  status: "verified" | "pending" | "rejected";
  amount?: number;
  created_at?: { _seconds: number };
  user?: { displayName?: string };
}

interface RecentTransactionsAdminProps {
  transactions: Transaction[];
  loading: boolean;
}

// helpers
function formatIDR(amount: number, locale: string) {
  if (amount >= 1_000_000)
    return `Rp ${(amount / 1_000_000).toFixed(1).replace(".0", "")}jt`;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(t: ReturnType<typeof useTranslations>, seconds?: number) {
  if (!seconds) return "-";

  const diffMs = Date.now() - seconds * 1000;
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return t("time.justNow");
  if (mins < 60) return t("time.minutesAgo", { value: mins });

  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return t("time.hoursAgo", { value: hrs });

  return t("time.daysAgo", { value: Math.floor(hrs / 24) });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// avatar palette (lebih cerah)
const AVATAR_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
] as const;

function avatarColor(name: string) {
  const idx =
    [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

type FilterKey = "all" | "verified" | "pending" | "rejected";

function SkeletonRow() {
  return (
    <li className="flex items-center gap-3 px-3 py-3">
      <div className="bg-muted h-10 w-10 animate-pulse rounded-xl" />

      <div className="flex-1 space-y-2">
        <div className="bg-muted h-3 w-28 animate-pulse rounded-full" />
        <div className="bg-muted h-2.5 w-16 animate-pulse rounded-full" />
      </div>

      <div className="space-y-2 text-right">
        <div className="bg-muted ml-auto h-3 w-20 animate-pulse rounded-full" />
        <div className="bg-muted ml-auto h-4 w-14 animate-pulse rounded-full" />
      </div>
    </li>
  );
}

export function RecentTransactionsAdmin({
  transactions,
  loading,
}: RecentTransactionsAdminProps) {
  const t = useTranslations("adminDashboard.recentTransactions");
  const locale = useLocale();

  const [filter, setFilter] = useState<FilterKey>("all");

  const statusConfig = {
    verified: {
      label: t("status.verified"),
      badge: "bg-emerald-100 text-emerald-700",
    },
    pending: {
      label: t("status.pending"),
      badge: "bg-amber-100 text-amber-700",
    },
    rejected: {
      label: t("status.rejected"),
      badge: "bg-rose-100 text-rose-700",
    },
  } as const;

  const filterTabs: { key: FilterKey; label: string }[] = [
    { key: "all", label: t("filters.all") },
    { key: "verified", label: t("filters.verified") },
    { key: "pending", label: t("filters.pending") },
    { key: "rejected", label: t("filters.rejected") },
  ];

  const sorted = transactions
    .slice()
    .sort(
      (a, b) => (b.created_at?._seconds ?? 0) - (a.created_at?._seconds ?? 0),
    )
    .slice(0, 5);

  const filtered =
    filter === "all" ? sorted : sorted.filter((t) => t.status === filter);

  const countVerified = sorted.filter((t) => t.status === "verified").length;
  const countPending = sorted.filter((t) => t.status === "pending").length;
  const countRejected = sorted.filter((t) => t.status === "rejected").length;

  const totalAmount = sorted.reduce((acc, t) => acc + (t.amount ?? 0), 0);

  return (
    <Card className="border-border/50 flex h-full flex-col overflow-hidden rounded-2xl border">
      <CardHeader className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold">{t("title")}</span>

          <Link
            href="/admin/payments"
            className="flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 transition hover:bg-violet-200"
          >
            {t("seeAll")}
            <ArrowRight className="size-3" />
          </Link>
        </div>

        {/* filter */}
        <div className="mt-3 flex gap-2">
          {filterTabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                filter === key
                  ? "bg-primaryBlue border-transparent text-white"
                  : "border-border text-muted-foreground hover:bg-muted",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* summary */}
        {!loading && (
          <div className="bg-muted/60 mt-3 flex items-center justify-between rounded-xl px-3 py-2">
            {[
              {
                label: t("summary.total"),
                value: formatIDR(totalAmount, locale),
                color: "text-foreground",
              },
              {
                label: t("summary.verified"),
                value: String(countVerified),
                color: "text-emerald-600",
              },
              {
                label: t("summary.pending"),
                value: String(countPending),
                color: "text-amber-600",
              },
              {
                label: t("summary.rejected"),
                value: String(countRejected),
                color: "text-rose-600",
              },
            ].map(({ label, value, color }, i, arr) => (
              <div key={label} className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-muted-foreground text-xs">{label}</p>
                  <p className={cn("text-sm font-semibold", color)}>{value}</p>
                </div>

                {i < arr.length - 1 && <div className="bg-border h-6 w-px" />}
              </div>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-2 flex-1 p-0 pb-2">
        {loading ? (
          <ul className="px-2">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <SkeletonRow key={i} />
              ))}
          </ul>
        ) : filtered.length === 0 ? (
          <div className="text-muted-foreground flex h-28 items-center justify-center text-xs">
            {t("empty")}
          </div>
        ) : (
          <ul className="px-2">
            {filtered.map((txn) => {
              const name = txn.user?.displayName ?? t("fallbackUser");
              const initials = getInitials(name);
              const av = avatarColor(name);
              const cfg = statusConfig[txn.status];

              return (
                <li
                  key={txn.id}
                  className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold",
                      av.bg,
                      av.text,
                    )}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {formatDate(t, txn.created_at?._seconds)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold tabular-nums">
                      {formatIDR(txn.amount ?? 0, locale)}
                    </span>

                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        cfg.badge,
                      )}
                    >
                      {cfg.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
