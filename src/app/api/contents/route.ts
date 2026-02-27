import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "all";
        const limitParams = parseInt(searchParams.get("limit") || "20");

        let query: FirebaseFirestore.Query = adminDb.collection("contents");

        query = query.where("status", "==", "published");

        if (type !== "all") {
            query = query.where("type", "==", type);
        }

        // Mengubah sorting ke createdAt untuk menghindari issue dokumen yg kehilangan publishedAt
        query = query.orderBy("createdAt", "desc").limit(limitParams);

        const snapshot = await query.get();
        const contents = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`[PUBLIC FETCH] Ditemukan ${contents.length} dokumen valid.`);

        return NextResponse.json({ success: true, count: contents.length, data: contents });
    } catch (error: any) {
        console.error("GET /api/contents error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
