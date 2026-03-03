"use client";

import { useEffect, useState } from "react";
import { Clock, Eye, Download, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

export default function UserSubscriptionHistory() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch("/api/user/subscription");
                if (res.ok) {
                    const json = await res.json();
                    setTransactions(json.data?.subscriptions || []);
                }
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

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
            year: "numeric"
        }).format(new Date(seconds * 1000));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
            case "verified":
                return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sukses</Badge>;
            case "rejected":
                return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Ditolak</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <Card className="rounded-xl shadow-sm border border-gray-100 mt-6 bg-white animate-pulse">
                <CardContent className="h-48 p-6 flex flex-col items-center justify-center">
                    <div className="h-6 w-6 border-b-2 border-primaryBlue rounded-full animate-spin mb-3"></div>
                    <span className="text-sm font-medium text-gray-400">Memuat riwayat transaksi...</span>
                </CardContent>
            </Card>
        );
    }

    if (transactions.length === 0) return null;

    return (
        <Card className="rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden bg-white">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock size={20} className="text-primaryBlue" />
                    Riwayat Transaksi Langganan
                </h3>
            </div>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider pl-5">Invoice & Tanggal</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Nominal</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider pr-5">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                <TableCell className="pl-5 font-medium text-gray-900">
                                    <div>{item.invoice_number}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {formatDate(item.created_at?._seconds)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="font-semibold text-primaryBlue">{formatRupiah(item.amount)}</div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(item.status)}
                                </TableCell>
                                <TableCell className="text-right pr-5">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                                                <Eye size={14} /> Lihat
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md">
                                            <DialogHeader>
                                                <DialogTitle>Detail Transaksi</DialogTitle>
                                                <DialogDescription>
                                                    Invoice: {item.invoice_number}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="space-y-4 pt-4">
                                                <div className="flex justify-between items-center text-sm border-b pb-2">
                                                    <span className="text-gray-500">Status</span>
                                                    <span>{getStatusBadge(item.status)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm border-b pb-2">
                                                    <span className="text-gray-500">Tanggal Checkout</span>
                                                    <span className="font-medium">{formatDate(item.created_at?._seconds)}</span>
                                                </div>
                                                {item.verified_at && (
                                                    <div className="flex justify-between items-center text-sm border-b pb-2">
                                                        <span className="text-gray-500">Diverifikasi Pada</span>
                                                        <span className="font-medium">{formatDate(item.verified_at?._seconds)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-sm border-b pb-2">
                                                    <span className="text-gray-500">Nominal</span>
                                                    <span className="font-bold text-gray-900">{formatRupiah(item.amount)}</span>
                                                </div>

                                                <div className="pt-2">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Bukti Pembayaran Tersimpan:</p>
                                                    <div className="flex justify-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                        {item.payment_proof_url?.startsWith("data:image/") || item.payment_proof_url?.startsWith("http") ? (
                                                            <img src={item.payment_proof_url} alt="Bukti Transfer" className="max-h-48 object-contain rounded-md shadow-sm border border-gray-200" />
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <Download size={32} className="text-primaryBlue mb-2" />
                                                                <a href={item.payment_proof_url} download={`Bukti_${item.invoice_number}`} className="text-sm font-semibold text-primaryBlue hover:underline">Unduh File Bukti Transfer</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
