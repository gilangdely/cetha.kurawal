"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, ArrowUpRight } from "lucide-react";

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
      <div className="bg-primaryBlue border-primaryBlue/20 group relative flex flex-col justify-between rounded-3xl border p-5 text-white transition-all duration-300 hover:shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-xl bg-black/5">
              <Brain size={21} strokeWidth={2.5} className="opacity-50" />
            </div>
            <div>
              <div className="mb-2 h-3.5 w-16 animate-pulse rounded bg-white/20"></div>
              <div className="h-6 w-20 animate-pulse rounded bg-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const remaining = data.quota?.remaining_quota ?? 0;

  return (
    <div className="bg-primaryBlue border-primaryBlue/20 group relative flex flex-col justify-between rounded-3xl border p-5 text-white transition-all duration-300 hover:shadow-sm">
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/10 shadow-inner">
            <Brain size={21} strokeWidth={2.5} className="text-white" />
          </div>

          <div>
            <p className="text-sm font-medium opacity-80">AI Credits</p>
            <p className="text-xl font-black tracking-tight">
              {remaining}{" "}
              <span className="text-sm font-medium opacity-60">
                Kredit Tersisa
              </span>
            </p>
          </div>
        </div>

        <Link
          href="/daftar-harga"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-60 backdrop-blur-sm transition-all group-hover:bg-white/20 group-hover:opacity-100"
          title="Upgrade Plan"
        >
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}
