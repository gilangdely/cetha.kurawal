"use client";

import { Link } from "@/i18n/navigation";
import { SubscriptionTier } from "@/types/subscription";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Tag,
  Inbox,
  PlusCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Hash,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TableSubscriptionTiersAdminProps {
  tiers: SubscriptionTier[];
  loading: boolean;
  deleteTier: (id: string, name: string) => void;
  formatRupiah: (amount: number) => string;
}

export default function TableSubscriptionTiersAdmin({
  tiers,
  loading,
  deleteTier,
  formatRupiah,
}: TableSubscriptionTiersAdminProps) {
  const t = useTranslations("adminSubscriptionTiers.table");

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between px-8 py-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Tag size={12} strokeWidth={2.5} />
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
            {t("totalBadge", { count: tiers.length })}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="h-12 pl-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.tierInfo")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.pricingQuota")}
              </TableHead>
              <TableHead className="h-12 text-center text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.display")}
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
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i} className="border-none">
                    <TableCell colSpan={5} className="px-2 py-3">
                      <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-50" />
                    </TableCell>
                  </TableRow>
                ))
            ) : tiers.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-[2rem] bg-slate-50">
                      <Inbox className="size-8 text-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-600">
                        {t("empty.title")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t("empty.description")}
                      </p>
                    </div>
                    <Link
                      href="/admin/subscription-tiers/create"
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-100 transition-transform hover:scale-105 active:scale-95"
                    >
                      <PlusCircle size={14} />
                      {t("empty.createButton")}
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tiers.map((item) => (
                <TableRow
                  key={item.id}
                  className="group border-none transition-all duration-200 hover:bg-slate-50/80"
                >
                  {/* Nama & Slug */}
                  <TableCell className="rounded-l-[1.5rem] py-4 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100 transition-colors group-hover:bg-blue-50 group-hover:ring-blue-100">
                        <Zap
                          size={16}
                          className="text-slate-400 group-hover:text-blue-500"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-700">
                          {item.name}
                        </p>
                        <p className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                          id: {item.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Harga & Kuota */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-sm leading-none font-black text-slate-900">
                        {formatRupiah(item.price)}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <div className="size-1 rounded-full bg-blue-500" />
                        <p className="text-[11px] font-bold text-blue-600 italic">
                          {t("quota", { count: item.quota_amount })}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Urutan */}
                  <TableCell className="text-center">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 shadow-sm ring-4 ring-white">
                      {item.display_order}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase",
                        item.is_active
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-rose-500/10 text-rose-600",
                      )}
                    >
                      <div
                        className={cn(
                          "size-1.5 rounded-full",
                          item.is_active ? "bg-emerald-500" : "bg-rose-500",
                        )}
                      />
                      {item.is_active ? t("status.active") : t("status.paused")}
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell className="rounded-r-[1.5rem] pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200 active:scale-90">
                          <MoreHorizontal
                            size={18}
                            className="text-slate-400"
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-2xl border-slate-100 p-2 shadow-xl ring-0"
                      >
                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl"
                        >
                          <Link
                            href={`/admin/subscription-tiers/${item.id}/edit-subscription-tier`}
                            className="flex items-center py-2 text-slate-600"
                          >
                            <Edit size={14} className="mr-2 text-blue-500" />
                            <span className="text-xs font-bold text-blue-500">
                              {t("actions.edit")}
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-50" />

                        <DropdownMenuItem
                          onClick={() => deleteTier(item.id!, item.name)}
                          className="cursor-pointer rounded-xl py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                        >
                          <Trash2 size={14} className="mr-2 text-rose-600" />
                          <span className="text-xs font-bold tracking-wider">
                            {t("actions.delete")}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
