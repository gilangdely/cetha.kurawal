"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    CheckCircle, XCircle, Clock, Eye, Download, Info
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardDescription
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
            minute: "2-digit"
        }).format(new Date(seconds * 1000));
    };

    const handleAction = async (id: string, action: "verify" | "reject") => {
        if (!confirm(`Apakah Anda yakin ingin melakukan ${action === "verify" ? "Verifikasi" : "Penolakan"} pada transaksi ini?`)) return;

        setProcessingId(id);

        try {
            const res = await fetch(`/api/admin/subscriptions/${id}/${action}`, {
                method: "POST"
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
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case "verified":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Terverifikasi</Badge>;
            case "rejected":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Verifikasi Pembayaran</h1>
                    <p className="text-muted-foreground text-sm mt-1">Cek bukti transfer dan aktifkan paket berlangganan pengguna.</p>
                </div>
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex gap-2">
                        <select
                            className="px-3 py-2 text-sm border-gray-200 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Semua Status</option>
                            <option value="pending">Menunggu Verifikasi (Pending)</option>
                            <option value="verified">Selesai (Terverifikasi)</option>
                            <option value="rejected">Ditolak</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider pl-6">Invoice & Waktu</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">User</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Paket / Nominal</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider pr-6">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primaryBlue" />
                                            <span className="text-sm font-medium">Memuat data transaksi...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <Info className="h-10 w-10 text-gray-300" />
                                            <p className="text-sm font-medium">Belum ada transaksi di status ini.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="pl-6 font-medium text-gray-900">
                                            <div>{item.invoice_number}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock size={12} /> {formatDate(item.created_at?._seconds)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-800">{item.user.displayName || "User Tanpa Nama"}</div>
                                            <div className="text-xs text-gray-500">{item.user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-semibold text-gray-900">{item.tier.name}</div>
                                            <div className="text-xs font-semibold text-primaryBlue">{formatRupiah(item.amount)}</div>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(item.status)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                                            <Eye size={14} /> Bukti TF
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle>Bukti Pembayaran</DialogTitle>
                                                            <DialogDescription>
                                                                Invoice: {item.invoice_number} ({item.user.email})
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                            {/* Render If Base64 Image */}
                                                            {item.payment_proof_url.startsWith("data:image/") || item.payment_proof_url.startsWith("http") ? (
                                                                <img src={item.payment_proof_url} alt="Bukti Transfer" className="max-h-[50vh] object-contain rounded-md shadow-sm border border-gray-200" />
                                                            ) : (
                                                                <div className="flex flex-col items-center">
                                                                    <Download size={48} className="text-primaryBlue mb-4" />
                                                                    <a href={item.payment_proof_url} download={`Bukti_${item.invoice_number}`} className="text-sm font-semibold text-primaryBlue hover:underline">Unduh File Dokumen (PDF)</a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {item.status === "pending" && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="h-8 bg-green-600 hover:bg-green-700"
                                                            disabled={processingId === item.id}
                                                            onClick={() => handleAction(item.id, "verify")}
                                                        >
                                                            {processingId === item.id ? <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" /> : <CheckCircle size={14} />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8"
                                                            disabled={processingId === item.id}
                                                            onClick={() => handleAction(item.id, "reject")}
                                                        >
                                                            {processingId === item.id ? <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" /> : <XCircle size={14} />}
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
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
