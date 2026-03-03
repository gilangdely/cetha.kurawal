import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { contentFormSchema } from "@/types/content";
import { slugify, extractYouTubeEmbedUrl, ensureUniqueSlug } from "@/app/lib/content-utils";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: Request) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");
        const status = searchParams.get("status");

        let query: FirebaseFirestore.Query = adminDb.collection("contents");

        if (type && type !== "all") {
            query = query.where("type", "==", type);
        }
        if (status) {
            query = query.where("status", "==", status);
        }

        query = query.orderBy("createdAt", "desc");

        const snapshot = await query.get();
        const contents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, data: contents });
    } catch (error: any) {
        console.error("GET Admin Contents error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const body = await req.json();
        const parsed = contentFormSchema.parse(body);

        let baseSlug = parsed.slug;
        if (!baseSlug) {
            baseSlug = slugify(parsed.title);
        }
        const finalSlug = await ensureUniqueSlug(baseSlug);

        const publishData = parsed.status === "published" ? {
            publishedAt: FieldValue.serverTimestamp(),
        } : {
            publishedAt: null,
        };

        const newDoc = {
            ...parsed,
            slug: finalSlug,
            youtubeUrl: extractYouTubeEmbedUrl(parsed.youtubeUrl),
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            createdByUid: auth.uid,
            updatedByUid: auth.uid,
            ...publishData
        };

        const docRef = await adminDb.collection("contents").add(newDoc);

        return NextResponse.json({ success: true, id: docRef.id });
    } catch (error: any) {
        console.error("POST Admin Contents error:", error);

        let message = error.message;
        if (error.issues) {
            message = error.issues.map((i: any) => i.message).join(", ");
        }

        return NextResponse.json({ ok: false, message, issues: error.issues }, { status: 400 });
    }
}
