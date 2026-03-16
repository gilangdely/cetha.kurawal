"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubscriptionTierForm } from "@/components/admin/subscription-tier-form";
import { SubscriptionTierFormSkeleton } from "@/components/subscription-tier-form-sekelton";
import { useLocale, useTranslations } from "next-intl";

export default function EditSubscriptionTierPage() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("adminSubscriptionTiers.editPage");
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin/subscription-tiers/${id}`);
        const data = await res.json();
        if (data.success) {
          setInitialData(data.data);
        } else {
          router.push(`/${locale}/admin/subscription-tiers`);
        }
      } catch (error) {
        console.error("Error fetching tier", error);
        router.push(`/${locale}/admin/subscription-tiers`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  if (loading) {
    return <SubscriptionTierFormSkeleton />;
  }

  return (
    <div>
      {/* Header */}
      <div className="border-border/60 border-b pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
      </div>
      <SubscriptionTierForm id={id} initialData={initialData} />
    </div>
  );
}
