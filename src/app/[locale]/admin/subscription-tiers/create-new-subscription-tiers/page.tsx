import { SubscriptionTierForm } from "@/components/admin/subscription-tier-form";
import { getTranslations } from "next-intl/server";

export default async function CreateSubscriptionTierPage() {
  const t = await getTranslations("adminSubscriptionTiers.createPage");

  return (
    <div>
      {/* Header */}
      <div className="border-border/60 border-b pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
      </div>
      <SubscriptionTierForm />
    </div>
  );
}
