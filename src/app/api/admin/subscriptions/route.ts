import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { FieldPath } from "firebase-admin/firestore";

export async function GET(req: Request) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let query: FirebaseFirestore.Query = adminDb.collection("subscriptions");

        if (status && status !== "all") {
            query = query.where("status", "==", status);
        }

        query = query.orderBy("created_at", "desc");

        const snapshot = await query.get();
        const subscriptions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Fetch user data for each subscription to show name/email
        const userIds = [...new Set(subscriptions.map((s: any) => s.user_id))];
        const usersMap: Record<string, any> = {};

        if (userIds.length > 0) {
            // Note: In a production app with thousands of users, do this in batches
            const usersSnapshot = await adminDb.collection("users").where(FieldPath.documentId(), "in", userIds.slice(0, 30)).get();
            usersSnapshot.docs.forEach(doc => {
                usersMap[doc.id] = doc.data();
            });
        }

        // Fetch tier data
        const tierIds = [...new Set(subscriptions.map((s: any) => s.tier_id))];
        const tiersMap: Record<string, any> = {};

        if (tierIds.length > 0) {
            const tiersSnapshot = await adminDb.collection("subscription_tiers").where(FieldPath.documentId(), "in", tierIds.slice(0, 30)).get();
            tiersSnapshot.docs.forEach(doc => {
                tiersMap[doc.id] = doc.data();
            });
        }

        const dataWithRelations = subscriptions.map((sub: any) => ({
            ...sub,
            user: usersMap[sub.user_id] || { displayName: "Unknown User", email: "-" },
            tier: tiersMap[sub.tier_id] || { name: "Unknown Tier", quota_amount: 0 }
        }));

        return NextResponse.json({ success: true, data: dataWithRelations });
    } catch (error: any) {
        console.error("GET Admin Subscriptions error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
