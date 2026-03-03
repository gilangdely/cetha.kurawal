import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const resolvedParams = await params;
        const { id } = resolvedParams;

        await adminDb.collection("contents").doc(id).update({
            status: "published",
            publishedAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
            updatedByUid: auth.uid,
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("POST Publish error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
