import { z } from "zod";

export type ContentType = "article" | "video";
export type ContentStatus = "draft" | "published";

export interface ContentDocument {
    id?: string; // from firestore doc id
    type: ContentType;
    title: string;
    slug: string;
    excerpt: string;
    contentHtml: string | null;
    youtubeUrl: string | null;
    coverImageUrl: string | null;
    tags: string[];
    status: ContentStatus;
    publishedAt: any; // Firestore Timestamp
    createdAt: any; // Firestore Timestamp
    updatedAt: any; // Firestore Timestamp
    createdByUid: string;
    updatedByUid: string;
}

// Zod schema for input validation
const baseSchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip").optional().or(z.literal("")),
    excerpt: z.string().max(250, "Excerpt maksimal 250 karakter").default(""),
    coverImageUrl: z.string().url("URL Gambar tidak valid").nullable().optional().or(z.literal("")),
    tags: z.array(z.string()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
});

export const contentFormSchema = z.discriminatedUnion("type", [
    baseSchema.extend({
        type: z.literal("article"),
        contentHtml: z.string().min(1, "Konten artikel tidak boleh kosong").refine(val => val.trim() !== "<p></p>", "Konten artikel tidak boleh kosong"),
        youtubeUrl: z.any().optional().nullable(),
    }),
    baseSchema.extend({
        type: z.literal("video"),
        contentHtml: z.any().optional().nullable(),
        youtubeUrl: z.string().url("URL YouTube tidak valid").min(1, "URL YouTube wajib diisi"),
    })
]);
