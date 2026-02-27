import { ContentForm } from "@/components/admin/content-form";
import { adminDb } from "@/app/lib/firebase-admin";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const doc = await adminDb.collection("contents").doc(id).get();
    if (!doc.exists) {
        return <div className="p-8 text-center text-gray-500">Konten tidak ditemukan.</div>;
    }

    const data = doc.data();

    return <ContentForm id={id} initialData={data} />;
}
