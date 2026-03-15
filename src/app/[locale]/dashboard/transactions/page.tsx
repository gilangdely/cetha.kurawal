"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db, auth } from "@/app/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import {
  Receipt,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ArrowUpRight,
  Maximize2,
  Package,
  Download,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import TransactionsSkeleton from "@/components/transaction-skeleton";

interface Transaction {
  id: string;
  invoice_number: string;
  amount: number;
  status: "pending" | "verified" | "rejected";
  payment_proof_url: string;
  created_at: any;
  tier_id: string;
}

interface TierDetail {
  name: string;
  description: string;
  features: string[];
}

const StatusBadge = ({
  status,
  labels,
}: {
  status: string;
  labels: {
    verified: string;
    rejected: string;
    pending: string;
  };
}) => {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black tracking-wider text-emerald-600 uppercase ring-1 ring-emerald-200 ring-inset">
          <CheckCircle2 size={10} strokeWidth={3} /> {labels.verified}
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black tracking-wider text-rose-600 uppercase ring-1 ring-rose-200 ring-inset">
          <XCircle size={10} strokeWidth={3} /> {labels.rejected}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black tracking-wider text-amber-600 uppercase ring-1 ring-amber-200 ring-inset">
          <Clock size={10} strokeWidth={3} /> {labels.pending}
        </span>
      );
  }
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-100/60 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center gap-4">
      <div className={`rounded-2xl p-3 ${color}`}>
        <Icon size={24} className="text-current" />
      </div>
      <div>
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          {title}
        </p>
        <p className="font-manrope text-xl font-black text-slate-900">
          {value}
        </p>
      </div>
    </div>
  </div>
);

function TransactionsContent() {
  const t = useTranslations("dashboardTransactionsPage");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const invoiceParam = searchParams.get("invoice");

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [tierDetail, setTierDetail] = useState<TierDetail | null>(null);
  const [loadingTier, setLoadingTier] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, "subscriptions"),
          where("user_id", "==", user.uid),
          orderBy("created_at", "desc"),
        );
        const querySnapshot = await getDocs(q);
        const txData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          txData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(txData);

        if (invoiceParam) {
          const foundTx = txData.find(
            (tx) => tx.invoice_number === invoiceParam,
          );
          if (foundTx) {
            handleOpenModal(foundTx);
          }
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchTransactions();
      else setLoading(false);
    });

    return () => unsubscribe();
  }, [invoiceParam]);

  const handleOpenModal = async (tx: Transaction) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
    setLoadingTier(true);
    setTierDetail(null);

    try {
      const tierDoc = await getDocs(
        query(
          collection(db, "subscription_tiers"),
          where("__name__", "==", tx.tier_id),
        ),
      );
      if (!tierDoc.empty) {
        setTierDetail(tierDoc.docs[0].data() as TierDetail);
      }
    } catch (error) {
      console.error("Error fetching tier detail:", error);
    } finally {
      setLoadingTier(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const stats = {
    total: transactions.length,
    success: transactions.filter((t) => t.status === "verified").length,
    pending: transactions.filter((t) => t.status === "pending").length,
  };

  if (loading) {
    return <TransactionsSkeleton />;
  }

  return (
    <div className="mx-auto w-full space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            {t("header.title")}
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            {t("header.description")}
          </p>
        </div>
        <Button
          onClick={() => router.push("/pricing")}
          className="h-11 rounded-2xl bg-blue-600 px-6 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95"
        >
          {t("header.upgradeButton")}{" "}
          <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title={t("stats.total")}
          value={stats.total}
          icon={TrendingUp}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title={t("stats.success")}
          value={stats.success}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          title={t("stats.pending")}
          value={stats.pending}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
        />
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center rounded-[40px] border-2 border-dashed border-gray-100 bg-white p-16 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 animate-pulse rounded-full bg-blue-100 opacity-50 blur-2xl"></div>
              <div className="relative rounded-full border border-gray-100 bg-white p-6 shadow-inner">
                <Receipt className="text-gray-200" size={64} strokeWidth={1} />
              </div>
            </div>
            <h3 className="mb-2 text-2xl font-black text-gray-900">
              {t("empty.title")}
            </h3>
            <p className="mx-auto mb-8 max-w-xs font-medium text-gray-500">
              {t("empty.description")}
            </p>
            <Button
              onClick={() => router.push("/dashboard/my-profile/subscription")}
              className="rounded-3xl bg-gray-900 px-8 py-6 text-lg font-black text-white shadow-xl transition-all hover:scale-105 hover:bg-black active:scale-95"
            >
              {t("empty.cta")}
            </Button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-sm border border-slate-200/70 bg-white shadow-sm shadow-slate-100/70">
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-6 py-4 text-left text-[11px] font-black tracking-[0.14em] text-slate-500 uppercase">
                      {t("table.invoice")}
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-black tracking-[0.14em] text-slate-500 uppercase">
                      {t("table.date")}
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-black tracking-[0.14em] text-slate-500 uppercase">
                      {t("table.amount")}
                    </th>
                    <th className="px-6 py-4 text-left text-[11px] font-black tracking-[0.14em] text-slate-500 uppercase">
                      {t("table.status")}
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-black tracking-[0.14em] text-slate-500 uppercase">
                      {t("table.action")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => handleOpenModal(tx)}
                      className="cursor-pointer border-b border-slate-100 transition-colors last:border-none hover:bg-blue-50/40"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                            <Tag size={16} />
                          </div>
                          <p className="font-mono text-xs font-bold tracking-wider text-blue-600 uppercase">
                            {tx.invoice_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                          <Calendar size={14} strokeWidth={2.5} />
                          {formatDate(tx.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={tx.status}
                          labels={{
                            verified: t("status.verified"),
                            rejected: t("status.rejected"),
                            pending: t("status.pending"),
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-blue-600 hover:text-white">
                          {t("table.detail")} <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 p-4 md:hidden">
              {transactions.map((tx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={tx.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleOpenModal(tx)}
                  className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] font-bold tracking-wider text-blue-600 uppercase">
                        {tx.invoice_number}
                      </p>
                      <p className="mt-1 text-lg font-black text-slate-900">
                        {formatCurrency(tx.amount)}
                      </p>
                    </div>
                    <StatusBadge
                      status={tx.status}
                      labels={{
                        verified: t("status.verified"),
                        rejected: t("status.rejected"),
                        pending: t("status.pending"),
                      }}
                    />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Calendar size={13} strokeWidth={2.5} />{" "}
                      {formatDate(tx.created_at)}
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedTx && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[40px] bg-white shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/80 px-8 py-6 backdrop-blur-md">
                <div>
                  <h3 className="text-xl font-black text-gray-900">
                    {t("modal.title")}
                  </h3>
                  <p className="mt-1 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    {selectedTx.invoice_number}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full bg-gray-100 p-2.5 text-gray-900 transition-colors hover:bg-gray-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="scrollbar-none flex-1 space-y-8 overflow-y-auto p-8 pt-6">
                {/* STEPPER */}
                <div className="relative flex items-start justify-between px-4">
                  <div className="absolute top-5 right-8 left-8 -z-10 h-[2px] bg-gray-100"></div>
                  {[
                    { label: t("stepper.checkout"), active: true, done: true },
                    {
                      label: t("stepper.verification"),
                      active:
                        selectedTx.status === "pending" ||
                        selectedTx.status === "verified",
                      done: selectedTx.status === "verified",
                    },
                    {
                      label: t("stepper.done"),
                      active: selectedTx.status === "verified",
                      done: selectedTx.status === "verified",
                    },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-4 shadow-sm transition-all duration-500 ${
                          step.done
                            ? "border-emerald-50 bg-emerald-500 text-white"
                            : step.active
                              ? "border-blue-50 bg-blue-600 text-white"
                              : "border-white bg-white text-gray-200"
                        }`}
                      >
                        {step.done ? (
                          <CheckCircle2 size={16} strokeWidth={3} />
                        ) : (
                          <span className="text-xs font-black">{i + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-black tracking-wider uppercase ${step.active ? "text-gray-900" : "text-gray-300"}`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  {/* LEFT: TRX INFO */}
                  <div className="space-y-6">
                    <div className="space-y-4 rounded-[32px] bg-gray-50 p-6">
                      <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        {t("paymentInfo.title")}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-500">
                            {t("paymentInfo.status")}
                          </span>
                          <StatusBadge
                            status={selectedTx.status}
                            labels={{
                              verified: t("status.verified"),
                              rejected: t("status.rejected"),
                              pending: t("status.pending"),
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-500">
                            {t("paymentInfo.date")}
                          </span>
                          <span className="text-sm font-black text-gray-900 italic">
                            {formatDate(selectedTx.created_at)}
                          </span>
                        </div>
                        <div className="flex items-end justify-between border-t border-gray-200 pt-3">
                          <span className="text-sm font-bold text-gray-500">
                            {t("paymentInfo.total")}
                          </span>
                          <span className="text-2xl font-black tracking-tight text-blue-600">
                            {formatCurrency(selectedTx.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="px-4 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                        {t("proof.title")}
                      </p>
                      <div className="group relative aspect-[4/3] overflow-hidden rounded-[32px] border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-blue-300">
                        {selectedTx.payment_proof_url ? (
                          <>
                            <Image
                              src={selectedTx.payment_proof_url}
                              alt={t("proof.imageAlt")}
                              fill
                              className="object-contain p-4"
                            />
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              onClick={() => setZoomImage(true)}
                              className="absolute inset-0 flex cursor-zoom-in items-center justify-center bg-gray-900/40 backdrop-blur-[2px]"
                            >
                              <div className="rounded-full border border-white/30 bg-white/20 p-4 text-white backdrop-blur-md">
                                <Maximize2 size={24} />
                              </div>
                            </motion.div>
                          </>
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-300">
                            <AlertCircle size={40} strokeWidth={1} />
                            <span className="text-xs font-bold italic">
                              {t("proof.unavailable")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TIER INFO */}
                  <div className="space-y-6">
                    {loadingTier ? (
                      <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[32px] bg-gray-50">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          {t("tier.loading")}
                        </p>
                      </div>
                    ) : tierDetail ? (
                      <div className="rounded-[32px] bg-blue-600 p-6 text-white shadow-xl shadow-blue-100">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
                            <Package size={20} />
                          </div>
                          <h4 className="text-xl font-black">
                            {tierDetail.name}
                          </h4>
                        </div>
                        <p className="mb-6 text-sm leading-relaxed font-medium text-blue-50">
                          {tierDetail.description}
                        </p>

                        <div className="space-y-3">
                          <p className="mb-2 text-[10px] font-black tracking-widest text-blue-200 uppercase">
                            {t("tier.mainFeatures")}
                          </p>
                          {tierDetail.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/20">
                                <CheckCircle2 size={12} strokeWidth={3} />
                              </div>
                              <span className="text-xs font-bold text-white/90">
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center rounded-[32px] bg-gray-50 p-8 text-center">
                        <AlertCircle className="mb-2 text-gray-300" size={32} />
                        <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                          {t("tier.notFound")}
                        </p>
                      </div>
                    )}

                    <div className="rounded-[32px] border border-gray-100 bg-white p-6">
                      <p className="text-xs leading-relaxed font-bold text-gray-500 italic">
                        {t("note")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-gray-100 p-8">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="h-12 flex-1 rounded-2xl bg-gray-100 font-black text-gray-900 hover:bg-gray-200"
                >
                  {t("common.close")}
                </Button>
                {selectedTx.payment_proof_url && (
                  <Button
                    onClick={() =>
                      window.open(selectedTx.payment_proof_url, "_blank")
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 p-0 text-white hover:bg-blue-700"
                  >
                    <Download size={20} />
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoomImage && selectedTx && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-gray-900/95 p-6"
            onClick={() => setZoomImage(false)}
          >
            <button className="absolute top-10 right-10 text-white transition-colors hover:text-blue-400">
              <X size={48} strokeWidth={1} />
            </button>
            <div className="relative h-full w-full">
              <Image
                src={selectedTx.payment_proof_url}
                alt={t("proof.zoomImageAlt")}
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsSkeleton />}>
      <TransactionsContent />
    </Suspense>
  );
}
