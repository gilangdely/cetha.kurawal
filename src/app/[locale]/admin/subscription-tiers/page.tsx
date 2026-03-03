"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Inbox, CheckCircle, XCircle } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
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
            const url = new URL("/api/admin/subscription-tiers", window.location.origin);
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
        if (!confirm(`Yakin ingin menghapus tier "${name}" secara permanen?`)) return;
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Subscription Tier</h1>
                    <p className="text-muted-foreground text-sm mt-1">Kelola paket langganan dan harga untuk user.</p>
                </div>
                <Button asChild className="bg-primaryBlue hover:bg-blue-700 shadow-sm gap-2">
                    <Link href="/id/admin/subscription-tiers/create">
                        <PlusCircle size={16} />
                        Tambah Tier Baru
                    </Link>
                </Button>
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="text-sm text-gray-600 font-medium px-2">Data Subscription Tiers</div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider pl-6">Nama Tier</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Harga & Kuota</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider w-[120px]">Urutan</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider w-[120px]">Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider pr-6 w-[80px]">Opsi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primaryBlue" />
                                            <span className="text-sm font-medium">Memuat data tier...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : tiers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Inbox className="h-10 w-10 text-gray-300" />
                                            <p className="text-sm font-medium">Data tier langganan belum tersedia.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tiers.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="pl-6 font-medium text-gray-900">
                                            {item.name}
                                            <div className="text-xs text-gray-500 font-normal">/{item.slug}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-800">{formatRupiah(item.price)}</div>
                                            <div className="text-xs text-gray-500">+{item.quota_amount} Kuota</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-gray-600 bg-white">
                                                {item.display_order}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`font-semibold text-xs border ${item.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                                                }`}>
                                                {item.is_active ? (
                                                    <span className="flex items-center gap-1"><CheckCircle size={12} /> Aktif</span>
                                                ) : (
                                                    <span className="flex items-center gap-1"><XCircle size={12} /> Nonaktif</span>
                                                )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" title="Aksi">
                                                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg">
                                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                                        <Link href={`/id/admin/subscription-tiers/${item.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4 text-primaryBlue" /> Edit Tier
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer focus:bg-red-50 focus:text-red-600" onClick={() => deleteTier(item.id!, item.name)}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-red-500" /> <span className="text-red-600 font-medium">Hapus Data</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
