"use client";

import {
  CheckCircle,
  Clock,
  Download,
  Eye,
  Info,
  ReceiptText,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface FilterTab {
  value: string;
  label: string;
  count: number;
}

interface TablePaymentsAdminProps {
  transactions: any[];
  loading: boolean;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  filterTabs: FilterTab[];
  processingId: string | null;
  handleAction: (id: string, action: "verify" | "reject") => void;
  getStatusBadge: (status: string) => React.ReactNode;
  formatDate: (seconds?: number) => string;
  formatRupiah: (amount: number) => string;
}

export default function TablePaymentsAdmin({
  transactions,
  loading,
  statusFilter,
  setStatusFilter,
  filterTabs,
  processingId,
  handleAction,
  getStatusBadge,
  formatDate,
  formatRupiah,
}: TablePaymentsAdminProps) {
  const t = useTranslations("adminPayments.table");

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <ReceiptText size={12} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-800">
              {t("title")}
            </h2>
          </div>
          <p className="pl-8 text-xs font-medium text-slate-400">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-50 px-4 py-1.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100">
            {t("totalBadge", { count: transactions.length })}
          </span>
        </div>
      </div>

      <div className="border-y border-slate-100 px-6 pt-4 pb-0">
        <div className="flex items-center gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`-mb-px flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-xs font-bold tracking-wide transition-all duration-150 ${
                statusFilter === tab.value
                  ? "border-blue-600 bg-blue-50/60 text-blue-700"
                  : "border-transparent text-slate-400 hover:bg-slate-50 hover:text-slate-600"
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

      <div className="overflow-x-auto px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="h-12 pl-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.invoiceTime")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.user")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.packageAmount")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.status")}
              </TableHead>
              <TableHead className="h-12 pr-6 text-right text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i} className="border-none">
                    <TableCell colSpan={5} className="px-2 py-3">
                      <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-50" />
                    </TableCell>
                  </TableRow>
                ))
            ) : transactions.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-[2rem] bg-slate-50">
                      <Info className="size-8 text-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-600">
                        {t("empty.title")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t("empty.description")}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((item) => (
                <TableRow
                  key={item.id}
                  className="group border-none transition-all duration-200 hover:bg-slate-50/80"
                >
                  <TableCell className="rounded-l-[1.5rem] py-4 pl-6">
                    <p className="font-mono text-sm font-bold tracking-tight text-slate-800">
                      {item.invoice_number}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-400">
                      <Clock size={11} />
                      {formatDate(item.created_at?._seconds)}
                    </p>
                  </TableCell>

                  <TableCell className="py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-xs font-bold text-slate-700 shadow-sm ring-1 ring-slate-100 transition-colors group-hover:bg-blue-50 group-hover:ring-blue-100">
                        {(item.user.displayName ||
                          t("fallback.initial"))[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {item.user.displayName ||
                            t("fallback.userWithoutName")}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <p className="text-sm font-bold text-slate-700">
                      {item.tier.name}
                    </p>
                    <p className="mt-0.5 text-[11px] font-bold text-blue-600 italic">
                      {formatRupiah(item.amount)}
                    </p>
                  </TableCell>

                  <TableCell className="py-4">
                    {getStatusBadge(item.status)}
                  </TableCell>

                  <TableCell className="rounded-r-[1.5rem] py-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600">
                            <Eye size={13} />
                            {t("actions.viewProof")}
                          </button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-base font-bold">
                              {t("proofDialog.title")}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-slate-400">
                              {t("proofDialog.invoiceLabel")}:{" "}
                              <span className="font-mono font-semibold text-slate-600">
                                {item.invoice_number}
                              </span>{" "}
                              · {item.user.email}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-center rounded-xl border border-slate-100 bg-slate-50 p-4">
                            {item.payment_proof_url.startsWith("data:image/") ||
                            item.payment_proof_url.startsWith("http") ? (
                              <img
                                src={item.payment_proof_url}
                                alt={t("proofDialog.imageAlt")}
                                className="max-h-[50vh] rounded-xl border border-slate-200 object-contain shadow-sm"
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
                                  className="text-sm font-bold text-blue-600 hover:underline"
                                >
                                  {t("proofDialog.downloadPdf")}
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
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600 shadow-sm transition-all duration-150 hover:border-emerald-500 hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            title={t("actions.verify")}
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
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 shadow-sm transition-all duration-150 hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                            title={t("actions.reject")}
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
  );
}
