import { ContentForm } from "@/components/admin/content-form";
import { getTranslations } from "next-intl/server";

export default async function NewContentPage() {
  const t = await getTranslations("adminContents.createPage");

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto">
        <div className="border-border/60 mb-6 border-b pb-5">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("description")}
          </p>
        </div>
        <ContentForm />
      </div>
    </main>
  );
}
