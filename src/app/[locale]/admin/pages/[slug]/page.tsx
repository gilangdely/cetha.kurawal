// app/[locale]/admin/pages/[slug]/page.tsx
import { PageEditor } from "@/components/admin/page-editor";
import { mockPages } from "@/lib/admin/mock";

export default function EditPage({ params }: { params: { slug: string } }) {
  const page =
    mockPages.find((p) => p.slug === params.slug) ??
    mockPages.find((p) => `/${p.slug}` === params.slug);

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Edit Page</h1>
      <p className="text-sm text-muted-foreground">
        Editing: <span className="font-mono">/{params.slug}</span>
      </p>

      <div className="pt-4">
        <PageEditor
          mode="edit"
          initial={{
            title: page?.title ?? "Untitled",
            slug: page?.slug ?? params.slug,
            content: page
              ? `# ${page.title}\n\nIni dummy content untuk /${page.slug}.`
              : "",
            published: page?.status === "published",
            metaTitle: page?.title ?? "",
            metaDescription: "Dummy meta description for SEO.",
          }}
        />
      </div>
    </div>
  );
}

