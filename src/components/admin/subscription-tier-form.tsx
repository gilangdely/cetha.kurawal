"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubscriptionTierFormProps {
  id?: string;
  initialData?: any;
}

export function SubscriptionTierForm({
  id,
  initialData,
}: SubscriptionTierFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("adminSubscriptionTiers.form");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    quota_amount: 0,
    description: "",
    currency: "IDR",
    is_active: true,
    is_recommended: false,
    display_order: 0,
  });

  const [features, setFeatures] = useState<string[]>([""]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        price: initialData.price || 0,
        quota_amount: initialData.quota_amount || 0,
        description: initialData.description || "",
        currency: initialData.currency || "IDR",
        is_active: initialData.is_active ?? true,
        is_recommended: initialData.is_recommended ?? false,
        display_order: initialData.display_order || 0,
      });

      if (initialData.features && initialData.features.length > 0) {
        setFeatures(initialData.features);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures.length > 0 ? newFeatures : [""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const filteredFeatures = features.filter((f) => f.trim() !== "");

      if (filteredFeatures.length === 0) {
        throw new Error(t("errors.featureRequired"));
      }

      const payload = {
        ...formData,
        price: Number(formData.price),
        quota_amount: Number(formData.quota_amount),
        display_order: Number(formData.display_order),
        features: filteredFeatures,
      };

      const url = id
        ? `/api/admin/subscription-tiers/${id}`
        : `/api/admin/subscription-tiers`;

      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || json.ok === false || json.success === false) {
        throw new Error(json.message || json.error || t("errors.saveFailed"));
      }

      router.push(`/${locale}/admin/subscription-tiers`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3"
      >
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card className="border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <CardTitle className="text-base font-semibold">
                {t("sections.basic")}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pt-5 pb-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>{t("fields.name")} *</Label>
                  <Input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("placeholders.name")}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.slug")} *</Label>
                  <Input
                    required
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder={t("placeholders.slug")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label>{t("fields.price")}</Label>
                  <Input
                    required
                    type="number"
                    min="0"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.quota")}</Label>
                  <Input
                    required
                    type="number"
                    min="0"
                    name="quota_amount"
                    value={formData.quota_amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("fields.description")}</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("placeholders.description")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <CardTitle className="text-base font-semibold">
                {t("sections.features")}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-6 pt-5 pb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={t("placeholders.feature", {
                      index: index + 1,
                    })}
                    className="flex-1"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="mt-2 flex items-center gap-2"
              >
                <Plus size={14} /> {t("actions.addFeature")}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card className="border-border/60 rounded-2xl shadow-sm">
            <CardHeader className="border-border/60 bg-muted/30 border-b px-6 py-5">
              <CardTitle className="text-base font-semibold">
                {t("sections.settings")}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 px-6 pt-5 pb-6">
              <div className="border-border/60 flex items-center justify-between rounded-xl border px-4 py-3">
                <Label htmlFor="is-active" className="text-sm font-medium">
                  {t("fields.activeStatus")}
                </Label>
                <Switch
                  id="is-active"
                  checked={formData.is_active}
                  onCheckedChange={(val) =>
                    setFormData((p) => ({ ...p, is_active: val }))
                  }
                />
              </div>

              <div className="border-border/60 flex items-center justify-between rounded-xl border px-4 py-3">
                <div>
                  <Label
                    htmlFor="is-recommended"
                    className="text-sm font-medium"
                  >
                    {t("fields.recommended")}
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    {t("hints.recommended")}
                  </p>
                </div>

                <Switch
                  id="is-recommended"
                  checked={formData.is_recommended}
                  onCheckedChange={(val) =>
                    setFormData((p) => ({ ...p, is_recommended: val }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>{t("fields.displayOrder")}</Label>
                <Input
                  required
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                />
                <p className="text-muted-foreground text-xs">
                  {t("hints.displayOrder")}
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            disabled={loading}
            className="bg-primaryBlue hover:bg-primaryBlueHover h-12 w-full gap-2 rounded-xl text-sm font-semibold text-white"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                <Save size={18} />
                {t("actions.save")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
