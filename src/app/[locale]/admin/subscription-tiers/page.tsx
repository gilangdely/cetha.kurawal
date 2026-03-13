"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  Inbox,
  CheckCircle,
  XCircle,
  Layers,
  Tag,
  Hash,
} from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubscriptionTier } from "@/types/subscription";

export default function AdminSubscriptionTiersPage() {
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
    if (!confirm(`Yakin ingin menghapus tier "${name}" secara permanen?`))
      return;
    try {
      await fetch(`/api/admin/subscription-tiers/${id}`, { method: "DELETE" });
      loadTiers();
    } catch (e) {
      console.error(e);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalActive = tiers.filter((t) => t.is_active).length;
  const totalInactive = tiers.filter((t) => !t.is_active).length;

  return (
    <div className="min-h-screen space-y-6 p-6">
      {/* ── Header ── */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-sm shadow-blue-200">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              Subscription Tiers
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-400">
              Kelola paket langganan dan harga untuk user.
            </p>
          </div>
        </div>
        <Link href="/id/admin/subscription-tiers/create">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-800 hover:shadow-md hover:shadow-blue-200">
            <PlusCircle size={15} />
            Tambah Tier Baru
          </button>
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Tier",
            value: tiers.length,
            icon: Layers,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            border: "border-blue-100",
          },
          {
            label: "Aktif",
            value: totalActive,
            icon: CheckCircle,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            border: "border-emerald-100",
          },
          {
            label: "Nonaktif",
            value: totalInactive,
            icon: XCircle,
            iconBg: "bg-red-50",
            iconColor: "text-red-500",
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
              <s.icon size={18} className={s.iconColor} />
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

      {/* ── Table Card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-gray-400" />
            <span className="text-sm font-semibold text-gray-700">
              Daftar Paket
            </span>
          </div>
          <span className="rounded-full border border-gray-100 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-400">
            {tiers.length} tier
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/60 hover:bg-gray-50/60">
                <TableHead className="pl-6 text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Nama Tier
                </TableHead>
                <TableHead className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Harga & Kuota
                </TableHead>
                <TableHead className="w-[120px] text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Urutan
                </TableHead>
                <TableHead className="w-[130px] text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Status
                </TableHead>
                <TableHead className="w-[60px] pr-6 text-right text-xs font-semibold tracking-widest text-gray-400 uppercase">
                  Opsi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      <TableCell className="py-4 pl-6">
                        <div className="mb-2 h-3.5 w-28 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-3 w-20 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="mb-2 h-3.5 w-24 animate-pulse rounded-lg bg-gray-100" />
                        <div className="h-3 w-16 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-10 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                      <TableCell>
                        <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="ml-auto h-8 w-8 animate-pulse rounded-lg bg-gray-100" />
                      </TableCell>
                    </TableRow>
                  ))
              ) : tiers.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-52 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                        <Inbox className="h-7 w-7 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          Belum ada tier
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Tambahkan paket langganan pertama
                        </p>
                      </div>
                      <Link href="/id/admin/subscription-tiers/create">
                        <button className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100">
                          <PlusCircle size={13} /> Tambah Tier
                        </button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                tiers.map((item, idx) => (
                  <TableRow
                    key={item.id}
                    className="group border-b border-gray-50 transition-colors duration-150 hover:bg-blue-50/25"
                  >
                    {/* Nama Tier */}
                    <TableCell className="py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                          <span className="text-xs font-bold text-blue-600">
                            {item.name.slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {item.name}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-gray-400">
                            /{item.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Harga & Kuota */}
                    <TableCell className="py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {formatRupiah(item.price)}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-blue-600">
                        +{item.quota_amount} Kuota
                      </p>
                    </TableCell>

                    {/* Urutan */}
                    <TableCell className="py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500">
                        <Hash size={10} className="text-gray-400" />
                        {item.display_order}
                      </span>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-4">
                      {item.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          Nonaktif
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-4 pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            title="Aksi"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 opacity-0 shadow-sm transition-all duration-150 group-hover:opacity-100 hover:border-gray-300 hover:text-gray-700"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 rounded-xl border-gray-100 shadow-lg"
                        >
                          <DropdownMenuItem
                            className="cursor-pointer rounded-lg focus:bg-blue-50"
                            asChild
                          >
                            <Link
                              href={`/id/admin/subscription-tiers/${item.id}/edit`}
                            >
                              <Edit className="mr-2 h-3.5 w-3.5 text-blue-500" />
                              <span className="text-sm font-medium">
                                Edit Tier
                              </span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100" />
                          <DropdownMenuItem
                            className="cursor-pointer rounded-lg focus:bg-red-50 focus:text-red-600"
                            onClick={() => deleteTier(item.id!, item.name)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                            <span className="text-sm font-medium text-red-600">
                              Hapus Data
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
    </div>
  );
}
