"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";

export function SettingsForm() {
  const t = useTranslations("adminSiteSettings.form");

  return (
    <div className="space-y-8">
      {/* SECTION 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Brand */}
        <Card className="border-gray-200 py-6 shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-gray-100 bg-gray-50/40">
            <CardTitle className="text-base font-semibold">
              {t("brand.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="site-name">
                  {t("brand.fields.siteName.label")}
                </Label>
                <Input
                  id="site-name"
                  defaultValue="Cetha"
                  placeholder={t("brand.fields.siteName.placeholder")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="site-tagline">
                  {t("brand.fields.tagline.label")}
                </Label>
                <Input
                  id="site-tagline"
                  defaultValue="AI Career Copilot"
                  placeholder={t("brand.fields.tagline.placeholder")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="primary-color">
                {t("brand.fields.primaryColor.label")}
              </Label>
              <Input
                id="primary-color"
                defaultValue="blue-600"
                placeholder={t("brand.fields.primaryColor.placeholder")}
              />
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t("brand.fields.primaryColor.hint")}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-email">
                {t("brand.fields.supportEmail.label")}
              </Label>
              <Input
                id="support-email"
                type="email"
                defaultValue="support@cetha.ai"
                placeholder={t("brand.fields.supportEmail.placeholder")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-gray-200 py-6 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/40 pb-4">
            <CardTitle className="text-base font-semibold">
              {t("statusSecurity.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  {t("statusSecurity.maintenance.title")}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t("statusSecurity.maintenance.description")}
                </p>
              </div>

              <Switch
                checked={false}
                onCheckedChange={() =>
                  alert(t("alerts.maintenanceToggleDummy"))
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">
                  {t("statusSecurity.requireLoginBeta.title")}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t("statusSecurity.requireLoginBeta.description")}
                </p>
              </div>

              <Switch
                defaultChecked
                onCheckedChange={() => alert(t("alerts.betaToggleDummy"))}
              />
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              {t("statusSecurity.footer")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* SEO */}
        <Card className="border-gray-200 py-6 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/40">
            <CardTitle className="text-base font-semibold">
              {t("seo.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="default-title">
                {t("seo.fields.defaultMetaTitle")}
              </Label>
              <Input
                id="default-title"
                defaultValue="Cetha - AI Career Copilot"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="default-description">
                {t("seo.fields.defaultMetaDescription")}
              </Label>
              <Textarea
                id="default-description"
                defaultValue="Cetha membantu kamu upgrade CV, profil LinkedIn, dan menemukan pekerjaan impian dengan bantuan AI."
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="default-image">
                {t("seo.fields.defaultShareImageUrl")}
              </Label>
              <Input
                id="default-image"
                defaultValue="https://cetha.ai/og-image.png"
              />
            </div>
          </CardContent>
        </Card>

        {/* Integrasi */}
        <Card className="border-gray-200 py-6 shadow-sm">
          <CardHeader className="border-b border-gray-100 bg-gray-50/40 pb-4">
            <CardTitle className="text-base font-semibold">
              {t("integrations.title")}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="ga-id">
                {t("integrations.fields.googleAnalyticsId")}
              </Label>
              <Input id="ga-id" placeholder="G-XXXXXXXXXX" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="meta-pixel">
                {t("integrations.fields.metaPixelId")}
              </Label>
              <Input id="meta-pixel" placeholder="XXXXXXXXXXXXXXX" />
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              {t("integrations.footer")}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
