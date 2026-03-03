"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Clock, Ticket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function UserQuotaWidget() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuota = async () => {
            try {
                const res = await fetch("/api/user/subscription");
                if (res.ok) {
                    const json = await res.json();
                    setData(json.data);
                }
            } catch (error) {
                console.error("Error fetching quota:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuota();
    }, []);

    if (loading) {
        return (
            <Card className="rounded-xl shadow-sm border border-gray-100 mb-6 bg-white animate-pulse">
                <CardContent className="h-32 p-6 flex items-center justify-center">
                    <div className="h-6 w-6 border-b-2 border-primaryBlue rounded-full animate-spin"></div>
                </CardContent>
            </Card>
        );
    }

    if (!data) return null;

    const isFree = data.subscriptionStatus !== "active";
    const remaining = data.quota?.remaining_quota || 0;
    const activeTierName = isFree ? "Free Account" : data.activeTierName;

    return (
        <Card className="rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">

                <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0 ${isFree ? 'bg-gray-400' : 'bg-primaryBlue'}`}>
                        {isFree ? <Clock size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 leading-none">Paket Langganan</h3>
                            <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0 border ${isFree ? 'bg-gray-100 text-gray-600 border-gray-200' : 'bg-blue-100 text-primaryBlue border-blue-200'}`}>
                                {activeTierName}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                            {isFree
                                ? "Upgrade untuk mendapatkan lebih banyak fitur dan prioritas review CV."
                                : "Kamu menikmati pengalaman premium dan akses prioritas. Terus berkarya!"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 pr-4 sm:border-r border-gray-100 w-full sm:w-auto">
                        <div className="bg-orange-100 text-accentOrange p-2 rounded-lg">
                            <Ticket size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 font-medium">Sisa Kuota AI</span>
                            <span className="font-bold text-xl text-gray-900 leading-none flex items-center gap-1">
                                {remaining} <span className="text-sm font-medium text-gray-500">Sesi</span>
                            </span>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto">
                        <Button asChild className="w-full bg-primaryBlue hover:bg-blue-700 text-white gap-2 rounded-lg shadow-sm">
                            <Link href="/id/daftar-harga">
                                <Zap size={16} className={`${isFree ? "animate-pulse text-yellow-300" : ""}`} />
                                {isFree ? "Mulai Berlangganan" : "Beli Kuota Tambahan"}
                            </Link>
                        </Button>
                    </div>
                </div>

            </div>
        </Card>
    );
}
