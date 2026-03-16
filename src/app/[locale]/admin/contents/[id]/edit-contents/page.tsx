import { ContentForm } from "@/components/admin/content-form";
import { adminDb } from "@/app/lib/firebase-admin";
import { getTranslations } from "next-intl/server";

export default async function EditContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("adminContents.editPage");
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const doc = await adminDb.collection("contents").doc(id).get();
  if (!doc.exists) {
    return <div className="p-8 text-center text-gray-500">{t("notFound")}</div>;
  }

  const raw = doc.data();
  // Serialize to strip Firestore Timestamp class instances into plain objects
  const data = JSON.parse(JSON.stringify(raw));

  return (
    <div className="space-y-6">
      <div className="border-border/60 border-b pb-5">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{t("description")}</p>
      </div>
      <ContentForm id={id} initialData={data} />
    </div>
  );
}
