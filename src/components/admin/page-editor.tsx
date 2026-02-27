// components/admin/page-editor.tsx
"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type EditorValue = {
  title: string;
  slug: string;
  content: string;
  published: boolean;
  metaTitle: string;
  metaDescription: string;
};

export function PageEditor({
  initial,
  mode,
}: {
  initial?: Partial<EditorValue>;
  mode: "new" | "edit";
}) {
  const [value, setValue] = useState<EditorValue>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    content: initial?.content ?? "",
    published: initial?.published ?? false,
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
  });

  const previewHref = useMemo(() => {
    const slug = value.slug?.trim() || "preview";
    return `/${slug}`;
  }, [value.slug]);

  function set<K extends keyof EditorValue>(key: K, v: EditorValue[K]) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main editor */}
      <div className="lg:col-span-8 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {mode === "new" ? "Create Page" : "Edit Page"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={value.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. About Cetha"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={value.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="e.g. about"
                />
                <div className="text-xs text-muted-foreground">
                  URL: <span className="font-mono">/{value.slug || "..."}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Content (Markdown placeholder)</Label>
              <Textarea
                value={value.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder={"# Heading\nTulis konten halaman di sini...\n\n- Point 1\n- Point 2"}
                className="min-h-[320px] font-mono"
              />
              <div className="text-xs text-muted-foreground">
                Nanti bisa diganti rich text editor (Tiptap/Quill) kalau sudah siap.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings panel */}
      <div className="lg:col-span-4 space-y-4">
        <Card className="border-blue-100">
          <CardHeader>
            <CardTitle className="text-base">Publish & Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Published</div>
                <div className="text-xs text-muted-foreground">
                  Jika aktif, konten tampil di website.
                </div>
              </div>
              <Switch
                checked={value.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => alert("Dummy: Saved")}
              >
                {value.published ? "Save & Publish" : "Save Draft"}
              </Button>
              <Button variant="outline" asChild>
                <a href={previewHref} target="_blank" rel="noreferrer">
                  Preview
                </a>
              </Button>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3 text-xs text-muted-foreground">
              Dummy mode. Nanti tombol ini akan call API route untuk simpan ke Firestore.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                value={value.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                placeholder="Title untuk SEO"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                value={value.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                placeholder="Deskripsi singkat (150-160 chars)"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}