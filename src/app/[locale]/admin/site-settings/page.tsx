"use client";

import { SettingsForm } from "@/components/admin/settings-form";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AdminSettingsPage() {
  const t = useTranslations("adminSiteSettings.page");

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm">
            {t("description")}
          </p>
        </div>

        <Button
          className="bg-blue-600 px-6 py-5 font-medium shadow-sm hover:bg-blue-700"
          onClick={() => alert(t("alerts.saveDummy"))}
        >
          {t("saveButton")}
        </Button>
      </div>
      <SettingsForm />
    </div>
  );
}
