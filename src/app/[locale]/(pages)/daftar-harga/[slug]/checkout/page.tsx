"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ChevronLeft, Loader2, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UploadPaymentProof } from "@/components/UploadPaymentProof";
import { SubscriptionTier } from "@/types/subscription";
import Image from "next/image";

import IconsBRI from "@/assets/payment/Bank Rakyat Indonesia (BRI)-logobase.net.svg";
import IconsBSI from "@/assets/payment/Logo Bank BSI - Dianisa.com.svg";
import IconsGopay from "@/assets/payment/GoPay Logo_Primary.svg";
import IconsDana from "@/assets/payment/Logo DANA -  dianisa.com.svg";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [tier, setTier] = useState<SubscriptionTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("bri");

  const paymentMethods = {
    bri: {
      bank: "Bank BRI",
      account: "1234567890",
      name: "Kurawal Creative",
      icon: IconsBRI,
    },
    bsi: {
      bank: "Bank BSI",
      account: "9876543210",
      name: "Kurawal Creative",
      icon: IconsBSI,
    },
    gopay: {
      bank: "GoPay",
      account: "081234567890",
      name: "Kurawal Creative",
      icon: IconsGopay,
    },
    dana: {
      bank: "Dana",
      account: "081234567890",
      name: "Kurawal Creative",
      icon: IconsDana,
    },
  };

  const selectedPayment =
    paymentMethods[selectedMethod as keyof typeof paymentMethods];

  useEffect(() => {
    const fetchTierInfo = async () => {
      try {
        const res = await fetch("/api/subscription-tiers");
        if (res.ok) {
          const json = await res.json();
          const tiers: SubscriptionTier[] = json.data || [];
          const foundTier = tiers.find((t) => t.slug === slug);

          if (foundTier) {
            setTier(foundTier);
          } else {
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
          payment_proof_url: paymentProofUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok || json.ok === false) {
        throw new Error(json.message || "Terjadi kesalahan saat checkout.");
      }

      alert(
        `Pembayaran berhasil dikirim dengan Invoice ${json.invoice}. Mohon menunggu verifikasi admin.`,
      );

      router.push("/id/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyAccount = () => {
    navigator.clipboard.writeText(selectedPayment.account);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="border-primaryBlue h-8 w-8 animate-spin rounded-full border-b-2" />
          <p className="font-medium text-gray-500">
            Bentar ya, nyiapin tagihan kamu...
          </p>
        </div>
      </div>
    );
  }

  if (!tier) return null;

  return (
    <div className="flex min-h-screen w-full lg:h-screen lg:overflow-hidden">
      {/* LEFT PANEL */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 lg:flex">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 text-white">
          <Link
            href="/id/daftar-harga"
            className="flex w-fit items-center gap-2 px-3 py-1.5 text-sm opacity-80 transition hover:opacity-100"
          >
            <ChevronLeft size={18} />
            Kembali ke Daftar Harga
          </Link>

          <div className="absolute top-30 right-14 max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg shadow-black/10 backdrop-blur-xl">
            {/* HEADER */}
            <div className="mb-4">
              <p className="text-xs tracking-wide text-white/60 uppercase">
                Upgrade Paket
              </p>

              <h2 className="mt-1 text-4xl font-bold text-white">
                {formatRupiah(tier.price)}
              </h2>
            </div>

            {/* PLAN INFO */}
            <div className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/70 font-bold text-white">
                {tier.name.charAt(0)}.
              </div>

              <div>
                <p className="font-semibold text-white">{tier.name}</p>
                <p className="text-xs text-white/70">
                  Tambahan {tier.quota_amount}x pemakaian
                </p>
              </div>
            </div>

            {/* SMALL NOTE */}
            <p className="mt-3 text-xs text-white/60">
              Kuota akan langsung ditambahkan ke akun setelah pembayaran
              berhasil.
            </p>

            {/* DIVIDER */}
            <div className="my-4 h-px bg-white/20" />

            {/* SUMMARY */}
            <div className="space-y-2 text-sm text-white/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(tier.price)}</span>
              </div>

              <div className="flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>{formatRupiah(tier.price)}</span>
              </div>
            </div>

            {/* FOOTER NOTE */}
            <p className="mt-4 text-xs text-white/50">
              Dengan melanjutkan pembayaran, kamu menyetujui syarat layanan
              kami.
            </p>
          </div>

          <p className="text-xs opacity-70">
            Pembayaran diverifikasi oleh admin setelah bukti transfer dikirim.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex flex-[1.2] items-center justify-center px-4 py-6">
        <div className="flex w-full flex-col gap-6 rounded-3xl p-6 md:max-w-xl">
          {/* HEADER */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Selesaikan Pembayaran
            </h2>
            <p className="text-sm text-gray-500">
              Pilih metode dan unggah bukti transfer
            </p>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <label className="mb-3 block text-xs font-bold tracking-wider text-gray-500 uppercase">
              Metode Pembayaran
            </label>

            <div className="grid grid-cols-4 gap-3">
              {Object.entries(paymentMethods).map(([id, method]) => (
                <button
                  key={id}
                  onClick={() => setSelectedMethod(id)}
                  className={`flex h-11 items-center justify-center rounded-xl border transition-colors ${
                    selectedMethod === id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex h-5 w-20 items-center justify-center">
                    <Image
                      src={method.icon}
                      alt={method.bank}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PAYMENT CARD */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="mb-4 text-center">
              <p className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
                Total Tagihan
              </p>

              <h3 className="text-2xl font-bold text-gray-900">
                {formatRupiah(tier.price)}
              </h3>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Bank Tujuan</span>
                <span className="font-semibold text-gray-800">
                  {selectedPayment.bank}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Nomor Rekening</span>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-gray-900">
                    {selectedPayment.account}
                  </span>

                  <button
                    onClick={copyAccount}
                    className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500">Atas Nama</span>
                <span className="font-semibold text-gray-800">
                  {selectedPayment.name}
                </span>
              </div>
            </div>
          </div>

          {/* UPLOAD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-800">
                Bukti Transfer
              </h4>

              <span className="rounded bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-500">
                WAJIB
              </span>
            </div>

            <UploadPaymentProof
              onUploadComplete={(base64Url) => {
                setPaymentProofUrl(base64Url);
              }}
            />

            {paymentProofUrl && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
                <CheckCircle size={14} />
                Bukti pembayaran berhasil dipilih
              </div>
            )}
          </div>

          {/* BUTTON */}
          <Button
            onClick={handleCheckout}
            disabled={submitting || !paymentProofUrl}
            className={`h-12 w-full rounded-xl font-semibold text-white transition ${
              !paymentProofUrl
                ? "bg-gray-200 text-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                Memproses...
              </span>
            ) : (
              "Konfirmasi Pembayaran"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
