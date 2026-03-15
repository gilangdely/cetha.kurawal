"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db, auth } from "@/app/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Receipt,
  Calendar,
  Tag,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ChevronRight,
  TrendingUp,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  Maximize2,
  Package,
  Download
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "verified":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-600 ring-1 ring-inset ring-emerald-200 uppercase tracking-wider">
          <CheckCircle2 size={10} strokeWidth={3} /> Berhasil
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-black text-rose-600 ring-1 ring-inset ring-rose-200 uppercase tracking-wider">
          <XCircle size={10} strokeWidth={3} /> Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black text-amber-600 ring-1 ring-inset ring-amber-200 uppercase tracking-wider">
          <Clock size={10} strokeWidth={3} /> Pending
        </span>
      );
  }
};

const StatCard = ({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-2xl ${color}`}>
      <Icon size={24} className="text-current" />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-gray-900 font-manrope">{value}</p>
    </div>
  </div>
);

function TransactionsContent() {
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
          orderBy("created_at", "desc")
        );
        const querySnapshot = await getDocs(q);
        const txData: Transaction[] = [];
        querySnapshot.forEach((doc) => {
          txData.push({ id: doc.id, ...doc.data() } as Transaction);
        });
        setTransactions(txData);

        if (invoiceParam) {
          const foundTx = txData.find(tx => tx.invoice_number === invoiceParam);
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
      const tierDoc = await getDocs(query(collection(db, "subscription_tiers"), where("__name__", "==", tx.tier_id)));
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "-";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  };

  const stats = {
    total: transactions.length,
    success: transactions.filter(t => t.status === "verified").length,
    pending: transactions.filter(t => t.status === "pending").length,
  };

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full mx-auto p-4 md:p-8 font-manrope">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-gray-500 font-medium mt-1">Status pembayaran & aktivasi paket premium Anda.</p>
        </div>
        <Button
          onClick={() => router.push("/pricing")}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-11 px-6 text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
        >
          Upgrade Paket <ArrowUpRight size={16} className="ml-2" />
        </Button>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Transaksi" value={stats.total} icon={TrendingUp} color="bg-blue-50 text-blue-600" />
        <StatCard title="Berhasil" value={stats.success} icon={CheckCircle2} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Menunggu Verifikasi" value={stats.pending} icon={Clock} color="bg-amber-50 text-amber-600" />
      </div>

      {/* TRANSACTION LIST */}
      <div className="space-y-4">
        {transactions.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 text-center border-2 border-dashed border-gray-100 flex flex-col items-center">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-full shadow-inner border border-gray-100">
                <Receipt className="text-gray-200" size={64} strokeWidth={1} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Belum Ada Transaksi</h3>
            <p className="text-gray-500 max-w-xs mx-auto font-medium mb-8">Ayo pilih paket pertamamu dan nikmati semua fitur AI Cetha tanpa batas!</p>
            <Button onClick={() => router.push("/pricing")} className="bg-gray-900 hover:bg-black text-white px-8 py-6 rounded-3xl font-black text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
              Lihat Paket Sekarang
            </Button>
          </div>
        ) : (
          <div className="grid gap-3">
            {transactions.map((tx) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={tx.id}
                whileHover={{ y: -2 }}
                onClick={() => handleOpenModal(tx)}
                className="group bg-white p-5 md:p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-md hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                    <Tag size={24} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest">{tx.invoice_number}</p>
                    <p className="text-lg font-black text-gray-900 mt-0.5">{formatCurrency(tx.amount)}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                      <Calendar size={12} strokeWidth={3} /> {formatDate(tx.created_at)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-0 pt-4 md:pt-0">
                  <StatusBadge status={tx.status} />
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </motion.div>
            ))}
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
              className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="sticky top-0 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex items-center justify-between z-10">
                <div>
                  <h3 className="text-xl font-black text-gray-900">Detail Transaksi</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{selectedTx.invoice_number}</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-900"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 p-8 pt-6 space-y-8 scrollbar-none">
                {/* STEPPER */}
                <div className="relative flex justify-between items-start px-4">
                  <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-100 -z-10"></div>
                  {[
                    { label: "Checkout", active: true, done: true },
                    { label: "Verifikasi", active: selectedTx.status === "pending" || selectedTx.status === "verified", done: selectedTx.status === "verified" },
                    { label: "Selesai", active: selectedTx.status === "verified", done: selectedTx.status === "verified" }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`h-10 w-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 shadow-sm ${step.done ? "bg-emerald-500 border-emerald-50 text-white" :
                          step.active ? "bg-blue-600 border-blue-50 text-white" :
                            "bg-white border-white text-gray-200"
                        }`}>
                        {step.done ? <CheckCircle2 size={16} strokeWidth={3} /> : <span className="text-xs font-black">{i + 1}</span>}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${step.active ? "text-gray-900" : "text-gray-300"}`}>{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* LEFT: TRX INFO */}
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-50 rounded-[32px] space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informasi Pembayaran</p>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">Status</span>
                          <StatusBadge status={selectedTx.status} />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-gray-500">Tanggal</span>
                          <span className="text-sm font-black text-gray-900 italic">{formatDate(selectedTx.created_at)}</span>
                        </div>
                        <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                          <span className="text-sm font-bold text-gray-500">Total Bayar</span>
                          <span className="text-2xl font-black text-blue-600 tracking-tight">{formatCurrency(selectedTx.amount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-4">Bukti Transfer</p>
                      <div className="group relative rounded-[32px] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 aspect-[4/3] transition-all hover:border-blue-300">
                        {selectedTx.payment_proof_url ? (
                          <>
                            <Image src={selectedTx.payment_proof_url} alt="Proof" fill className="object-contain p-4" />
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 1 }}
                              onClick={() => setZoomImage(true)}
                              className="absolute inset-0 bg-gray-900/40 flex items-center justify-center cursor-zoom-in backdrop-blur-[2px]"
                            >
                              <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 text-white">
                                <Maximize2 size={24} />
                              </div>
                            </motion.div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300">
                            <AlertCircle size={40} strokeWidth={1} />
                            <span className="text-xs font-bold italic">Bukti Tidak Tersedia</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TIER INFO */}
                  <div className="space-y-6">
                    {loadingTier ? (
                      <div className="h-64 flex flex-col items-center justify-center gap-3 bg-gray-50 rounded-[32px]">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Memuat rincian paket...</p>
                      </div>
                    ) : tierDetail ? (
                      <div className="p-6 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                            <Package size={20} />
                          </div>
                          <h4 className="text-xl font-black">{tierDetail.name}</h4>
                        </div>
                        <p className="text-sm font-medium text-blue-50 leading-relaxed mb-6">
                          {tierDetail.description}
                        </p>
                        
                        <div className="space-y-3">
                          <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">Fitur Utama</p>
                          {tierDetail.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                <CheckCircle2 size={12} strokeWidth={3} />
                              </div>
                              <span className="text-xs font-bold text-white/90">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 bg-gray-50 rounded-[32px] text-center">
                        <AlertCircle className="text-gray-300 mb-2" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail paket tidak ditemukan</p>
                      </div>
                    )}
                    
                    <div className="p-6 border border-gray-100 rounded-[32px] bg-white">
                      <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                        "Terima kasih telah mempercayai Cetha untuk mengakselerasi karier Anda. Hubungi kami jika ada kendala."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-gray-100 flex gap-3">
                <Button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-12 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-black"
                >
                  Tutup
                </Button>
                {selectedTx.payment_proof_url && (
                  <Button
                    onClick={() => window.open(selectedTx.payment_proof_url, '_blank')}
                    className="h-12 w-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center p-0"
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
            className="fixed inset-0 z-[200] bg-gray-900/95 flex items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setZoomImage(false)}
          >
            <button className="absolute top-10 right-10 text-white hover:text-blue-400 transition-colors">
              <X size={48} strokeWidth={1} />
            </button>
            <div className="relative w-full h-full">
              <Image src={selectedTx.payment_proof_url} alt="Proof Zoom" fill className="object-contain" priority />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    }>
      <TransactionsContent />
    </Suspense>
  );
}
