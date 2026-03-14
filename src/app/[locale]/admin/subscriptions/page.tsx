"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  Info,
  Filter,
  CreditCard,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminSubscriptionsPage() {
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (seconds?: number) => {
    if (!seconds) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(seconds * 1000));
  };

  const handleAction = async (id: string, action: "verify" | "reject") => {
    if (
      !confirm(
        `Apakah Anda yakin ingin melakukan ${action === "verify" ? "Verifikasi" : "Penolakan"} pada transaksi ini?`,
      )
    )
      return;

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
        alert("Gagal: " + data.error);
      }
    } catch (err: any) {
      alert("Error Processing: " + err.message);
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
            Pending
          </span>
        );
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Terverifikasi
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600">
            {status}
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
    { value: "all", label: "Semua", count: transactions.length },
    { value: "pending", label: "Pending", count: totalPending },
    { value: "verified", label: "Terverifikasi", count: totalVerified },
    { value: "rejected", label: "Ditolak", count: totalRejected },
  ];

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm shadow-blue-200">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Verifikasi Pembayaran
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-400">
              Cek bukti transfer dan aktifkan paket berlangganan pengguna.
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Menunggu Review",
            value: totalPending,
            icon: Clock,
            bg: "bg-amber-50",
            text: "text-amber-600",
            iconBg: "bg-amber-100",
            border: "border-amber-100",
          },
          {
            label: "Terverifikasi",
            value: totalVerified,
            icon: ShieldCheck,
            bg: "bg-emerald-50",
            text: "text-emerald-600",
            iconBg: "bg-emerald-100",
            border: "border-emerald-100",
          },
          {
            label: "Ditolak",
            value: totalRejected,
            icon: XCircle,
            bg: "bg-red-50",
            text: "text-red-600",
            iconBg: "bg-red-100",
            border: "border-red-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border bg-white ${s.border} flex items-center gap-4 px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div
              className={`h-10 w-10 rounded-xl ${s.iconBg} flex flex-shrink-0 items-center justify-center`}
            >
              <s.icon size={18} className={s.text} />
            </div>
            <div>
              <p className="text-2xl leading-none font-bold text-gray-900">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium text-gray-400">
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table Card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Filter Tabs */}
        <div className="border-b border-gray-100 px-6 pt-5 pb-0">
          <div className="flex items-center gap-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`-mb-px flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  statusFilter === tab.value
                    ? "border-blue-600 bg-blue-50/60 text-blue-700"
                    : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`min-w-[18px] rounded-full px-1.5 py-0.5 text-center text-[10px] leading-none font-bold ${
                      statusFilter === tab.value
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
                <TableHead className="pl-6 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Invoice & Waktu
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Pengguna
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Paket / Nominal
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="pr-6 text-right text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                /* Skeleton rows */
                Array(4)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell className="py-4 pl-6">
                        <div className="mb-2 h-3.5 w-28 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-3 w-20 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="mb-2 h-3.5 w-24 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-3 w-32 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="mb-2 h-3.5 w-20 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-3 w-16 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-20 animate-pulse rounded-full bg-gray-100" />
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex justify-end gap-2">
                          <div className="h-8 w-20 animate-pulse rounded-xl bg-gray-100" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : transactions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-52 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Info className="h-7 w-7 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Belum ada transaksi
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Tidak ada data untuk filter ini
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((item) => (
                  <TableRow
                    key={item.id}
                    className="group border-b border-gray-50 transition-colors duration-150 hover:bg-blue-50/30"
                  >
                    {/* Invoice & Time */}
                    <TableCell className="py-4 pl-6">
                      <p className="font-mono text-sm font-bold tracking-tight text-gray-800">
                        {item.invoice_number}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-400">
                        <Clock size={11} />
                        {formatDate(item.created_at?._seconds)}
                      </p>
                    </TableCell>

                    {/* User */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-xs font-bold text-white shadow-sm">
                          {(item.user.displayName || "U")[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {item.user.displayName || "User Tanpa Nama"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {item.user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Package / Amount */}
                    <TableCell className="py-4">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.tier.name}
                      </p>
                      <p className="mt-0.5 text-xs font-bold text-blue-600">
                        {formatRupiah(item.amount)}
                      </p>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      {getStatusBadge(item.status)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                              <Eye size={13} />
                              Bukti TF
                            </button>
                          </DialogTrigger>
                          <DialogContent className="rounded-2xl sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-base font-bold">
                                Bukti Pembayaran
                              </DialogTitle>
                              <DialogDescription className="text-xs text-gray-400">
                                Invoice:{" "}
                                <span className="font-mono font-semibold text-gray-600">
                                  {item.invoice_number}
                                </span>{" "}
                                · {item.user.email}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-center rounded-xl border border-gray-100 bg-gray-50 p-4">
                              {item.payment_proof_url.startsWith(
                                "data:image/",
                              ) || item.payment_proof_url.startsWith("http") ? (
                                <img
                                  src={item.payment_proof_url}
                                  alt="Bukti Transfer"
                                  className="max-h-[50vh] rounded-xl border border-gray-200 object-contain shadow-sm"
                                />
                              ) : (
                                <div className="flex flex-col items-center gap-3 py-4">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                                    <Download
                                      size={26}
                                      className="text-blue-500"
                                    />
                                  </div>
                                  <a
                                    href={item.payment_proof_url}
                                    download={`Bukti_${item.invoice_number}`}
                                    className="text-sm font-semibold text-blue-600 hover:underline"
                                  >
                                    Unduh File Dokumen (PDF)
                                  </a>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {item.status === "pending" && (
                          <>
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleAction(item.id, "verify")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm transition-all duration-150 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              title="Verifikasi"
                            >
                              {processingId === item.id ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                            </button>
                            <button
                              disabled={processingId === item.id}
                              onClick={() => handleAction(item.id, "reject")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 shadow-sm transition-all duration-150 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              title="Tolak"
                            >
                              {processingId === item.id ? (
                                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              ) : (
                                <XCircle size={14} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
