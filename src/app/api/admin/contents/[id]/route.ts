import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { contentFormSchema } from "@/types/content";
import { slugify, extractYouTubeEmbedUrl, ensureUniqueSlug } from "@/app/lib/content-utils";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await req.json();
        const parsed = contentFormSchema.parse(body);

        let baseSlug = parsed.slug;
        if (!baseSlug) {
            baseSlug = slugify(parsed.title);
        }
        const finalSlug = await ensureUniqueSlug(baseSlug, id);

        const docRef = adminDb.collection("contents").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
        }

        const currentData = docSnap.data();

        // Check if transitioning to published
        let publishData = {};
        if (parsed.status === "published" && currentData?.status !== "published") {
            publishData = { publishedAt: FieldValue.serverTimestamp() };
        } else if (parsed.status === "draft" && currentData?.status === "published") {
            publishData = { publishedAt: null };
        }

        const updateDoc = {
            ...parsed,
            slug: finalSlug,
            youtubeUrl: extractYouTubeEmbedUrl(parsed.youtubeUrl),
            updatedAt: FieldValue.serverTimestamp(),
            updatedByUid: auth.uid,
            ...publishData
        };

        await docRef.update(updateDoc);

        return NextResponse.json({ success: true, id });
    } catch (error: any) {
        console.error("PATCH Admin Contents error:", error);

        let message = error.message;
        if (error.issues) {
            message = error.issues.map((i: any) => i.message).join(", ");
        }

        return NextResponse.json({ ok: false, message, issues: error.issues }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        await adminDb.collection("contents").doc(id).delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE Admin Contents error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
