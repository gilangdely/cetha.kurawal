"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import ContentPaymentsAdmin from "@/components/content-stats-payments-admin";
import TablePaymentsAdmin from "@/components/table-payments-admin";

export default function AdminSubscriptionsPage() {
  const t = useTranslations("adminPayments");
  const locale = useLocale();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const url = new URL("/api/admin/subscriptions", window.location.origin);
      if (statusFilter !== "all") {
        url.searchParams.append("status", statusFilter);
      }
      const res = await fetch(url.toString());
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [statusFilter]);

  const formatRupiah = (amount: number) => {
    const localeTag = locale === "id" ? "id-ID" : "en-US";
    return new Intl.NumberFormat(localeTag, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (seconds?: number) => {
    if (!seconds) return "-";
    const localeTag = locale === "id" ? "id-ID" : "en-US";
    return new Intl.DateTimeFormat(localeTag, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(seconds * 1000));
  };

  const handleAction = async (id: string, action: "verify" | "reject") => {
    const actionText =
      action === "verify"
        ? t("page.confirmActions.verify")
        : t("page.confirmActions.reject");

    if (!confirm(t("page.confirmMessage", { action: actionText }))) return;

    setProcessingId(id);

    try {
      const res = await fetch(`/api/admin/subscriptions/${id}/${action}`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        alert(data.message);
        loadTransactions();
      } else {
        alert(t("page.alerts.failed", { error: data.error }));
      }
    } catch (err: any) {
      alert(t("page.alerts.errorProcessing", { error: err.message }));
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
            {t("status.pending")}
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t("status.verified")}
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {t("status.rejected")}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {t("status.unknown", { status })}
          </span>
        );
    }
  };

  const totalPending = transactions.filter(
    (t) => t.status === "pending",
  ).length;
  const totalVerified = transactions.filter(
    (t) => t.status === "verified",
  ).length;
  const totalRejected = transactions.filter(
    (t) => t.status === "rejected",
  ).length;

  const filterTabs = [
    { value: "all", label: t("filters.all"), count: transactions.length },
    { value: "pending", label: t("filters.pending"), count: totalPending },
    {
      value: "verified",
      label: t("filters.verified"),
      count: totalVerified,
    },
    { value: "rejected", label: t("filters.rejected"), count: totalRejected },
  ];

  return (
    <div className="min-h-screen space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {t("page.title")}
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-400">
              {t("page.description")}
            </p>
          </div>
        </div>
      </div>

      <ContentPaymentsAdmin
        totalPending={totalPending}
        totalVerified={totalVerified}
        totalRejected={totalRejected}
      />

      <TablePaymentsAdmin
        filterTabs={filterTabs}
        formatDate={formatDate}
        formatRupiah={formatRupiah}
        getStatusBadge={getStatusBadge}
        handleAction={handleAction}
        loading={loading}
        processingId={processingId}
        setStatusFilter={setStatusFilter}
        statusFilter={statusFilter}
        transactions={transactions}
      />
    </div>
  );
}
