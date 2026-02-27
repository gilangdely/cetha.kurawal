import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const resolvedParams = await params;
        const { slug } = resolvedParams;

        const snapshot = await adminDb
            .collection("contents")
            .where("slug", "==", slug)
            .where("status", "==", "published")
            .limit(1)
            .get();

        if (snapshot.empty) {
            return NextResponse.json({ success: false, message: "Konten tidak ditemukan" }, { status: 404 });
        }

        const doc = snapshot.docs[0];
        return NextResponse.json({
            success: true,
            data: {
                id: doc.id,
                ...doc.data(),
            }
        });
    } catch (error: any) {
        console.error("GET /api/contents/[slug] error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
