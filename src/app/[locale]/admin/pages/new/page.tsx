// app/[locale]/admin/pages/new/page.tsx
import { PageEditor } from "@/components/admin/page-editor";

export default function NewPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">New Page</h1>
      <p className="text-sm text-muted-foreground">
        Buat halaman baru untuk Cetha.
      </p>
      <div className="pt-4">
        <PageEditor mode="new" />
      </div>
    </div>
  );
}

