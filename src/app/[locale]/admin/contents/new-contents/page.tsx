import { ContentForm } from "@/components/admin/content-form";

export const metadata = {
  title: "Buat Konten Baru | Admin Kurawal",
  description:
    "Buat artikel atau video tip karier baru untuk platform Kurawal.",
};

export default function NewContentPage() {
  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto">
        <ContentForm />
      </div>
    </main>
  );
}
