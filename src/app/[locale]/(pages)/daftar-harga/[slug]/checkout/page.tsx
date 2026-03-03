"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, ShieldCheck, Mail, Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadPaymentProof } from "@/components/UploadPaymentProof";
import { SubscriptionTier } from "@/types/subscription";

export default function CheckoutPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [tier, setTier] = useState<SubscriptionTier | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTierInfo = async () => {
            try {
                // Find tier by slug. 
                // We'll fetch all tiers and filter by slug since our current API
                // doesn't have a /by-slug endpoint yet. This is perfectly fine for low tier counts.
                const res = await fetch("/api/subscription-tiers");
                if (res.ok) {
                    const json = await res.json();
                    const tiers: SubscriptionTier[] = json.data || [];
                    const foundTier = tiers.find(t => t.slug === slug);

                    if (foundTier) {
                        setTier(foundTier);
                    } else {
                        // Not found -> back to pricing
                        router.push("/id/daftar-harga");
                    }
                }
            } catch (err) {
                console.error("Failed to fetch tier data:", err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchTierInfo();
    }, [slug, router]);

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const handleCheckout = async () => {
        if (!tier || !tier.id || !paymentProofUrl) {
            setError("Harap unggah bukti pembayaran terlebih dahulu.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const res = await fetch("/api/subscriptions/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tier_id: tier.id,
                    payment_proof_url: paymentProofUrl
                })
            });

            const json = await res.json();

            if (!res.ok || json.ok === false) {
                throw new Error(json.message || "Terjadi kesalahan saat checkout.");
            }

            // Success -> redirect to dashboard or success page
            alert(`Pembayaran berhasil dikirim dengan Invoice ${json.invoice}. Mohon menunggu verifikasi admin.`);
            router.push("/id/dashboard");

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primaryBlue" />
                    <p className="text-gray-500 font-medium">Bentar ya, nyiapin tagihan kamu...</p>
                </div>
            </div>
        );
    }

    if (!tier) return null;

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header Back */}
                <Button variant="ghost" asChild className="mb-6 hover:bg-transparent px-0 font-medium text-gray-500 hover:text-gray-900 transition">
                    <Link href="/id/daftar-harga">
                        <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Harga
                    </Link>
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Form & Upload */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selesaikan Pembayaran</h1>
                            <p className="text-gray-600">Unggah bukti transfer untuk mengaktifkan paket berlangganan kamu.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-start gap-3">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <Card className="border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                            <div className="bg-blue-50/50 px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="bg-primaryBlue p-2 rounded-lg text-white">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 leading-tight">Transfer Bank (Manual)</h3>
                                    <p className="text-xs text-gray-500">Aman & Terverifikasi Admin</p>
                                </div>
                            </div>
                            <CardContent className="p-6 space-y-6">
                                {/* Rekening Tujuan */}
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
                                    <p className="text-sm font-medium text-gray-700">Silakan transfer tepat sebesar <span className="text-lg font-bold text-primaryBlue block">{formatRupiah(tier.price)}</span></p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                                            <span className="text-sm text-gray-500">Bank Tujuan</span>
                                            <span className="font-semibold text-gray-900">BCA (Bank Central Asia)</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-200 border-dashed">
                                            <span className="text-sm text-gray-500">Nomor Rekening</span>
                                            <span className="font-bold tracking-wider text-xl text-gray-900">123 456 7890</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Atas Nama</span>
                                            <span className="font-semibold text-gray-900">PT Cetha Kurawal Nusantara</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Upload Component */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Unggah Bukti Transfer <span className="text-red-500">*</span></h4>
                                    <p className="text-sm text-gray-500 mb-4">Pastikan nominal transfer, tanggal, dan nomor rekening tujuan terlihat jelas.</p>

                                    <UploadPaymentProof
                                        onUploadComplete={(base64Url) => {
                                            setPaymentProofUrl(base64Url);
                                        }}
                                    />

                                    {paymentProofUrl && (
                                        <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-2 text-sm font-medium">
                                            <CheckCircle size={18} />
                                            Bukti pembayaran berhasil dipilih.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-5 relative">
                        {/* Sticky sidebar */}
                        <div className="sticky top-28 space-y-6">
                            <Card className="border-gray-200 shadow-md rounded-2xl overflow-hidden relative">
                                {/* Decorative top border */}
                                <div className="h-1.5 w-full bg-gradient-to-r from-blue-400 to-indigo-600"></div>

                                <CardContent className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-4">Ringkasan Pesanan</h3>

                                    <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                                        <div className="w-12 h-12 bg-blue-100 text-primaryBlue flex items-center justify-center rounded-xl font-bold text-xl">
                                            {tier.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900">{tier.name}</h4>
                                            <p className="text-sm text-gray-500">Paket Langganan</p>
                                        </div>
                                    </div>

                                    <div className="py-4 space-y-3 border-b border-gray-100">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Tambahan Kuota</span>
                                            <span className="font-medium text-gray-900">+{tier.quota_amount}x Pemakaian</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">Masa Berlaku</span>
                                            <span className="font-medium text-gray-900">Selamanya (Selama kuota ada)</span>
                                        </div>
                                    </div>

                                    <div className="py-4 font-semibold text-lg flex justify-between items-center pb-6">
                                        <span className="text-gray-900">Total Harga</span>
                                        <span className="text-primaryBlue text-2xl">{formatRupiah(tier.price)}</span>
                                    </div>

                                    <Button
                                        onClick={handleCheckout}
                                        disabled={submitting || !paymentProofUrl}
                                        className="w-full h-14 text-base font-bold bg-primaryBlue hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? "Memproses Transaksi..." : "Kirim Bukti & Berlangganan"}
                                    </Button>

                                    <p className="text-[11px] text-center text-gray-500 mt-4 leading-relaxed flex items-center justify-center gap-1.5 px-2">
                                        Dengan klik tombol di atas, kamu setuju dengan Persyaratan Layanan langganan Cetha.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Help Box */}
                            <div className="bg-gray-100 rounded-2xl p-5 flex gap-3 text-sm text-gray-600 items-start">
                                <Mail size={20} className="text-gray-400 shrink-0 mt-0.5" />
                                <p>Butuh bantuan dengan pembayaran? Hubungi tim support kami di <span className="font-semibold text-primaryBlue cursor-pointer">hello@cetha.com</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
