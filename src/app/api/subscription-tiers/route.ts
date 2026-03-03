import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";

export async function GET() {
    try {
        const snapshot = await adminDb
            .collection("subscription_tiers")
            .where("is_active", "==", true)
            .orderBy("display_order", "asc")
            .get();

        const tiers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, data: tiers });
    } catch (error: any) {
        console.error("GET Public Subscription Tiers error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
