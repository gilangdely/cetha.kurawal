import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireSession } from "@/app/lib/session";

export async function GET(req: Request) {
    const auth = await requireSession();
    if (auth.error) return auth.error;

    try {
        // Fetch User Quota
        const quotaRef = adminDb.collection("user_quotas").doc(auth.uid);
        const quotaDoc = await quotaRef.get();
        let quotaData = quotaDoc.exists ? quotaDoc.data() : { total_quota: 2, used_quota: 0, remaining_quota: 2 }; // Default Free Quota

        // Fetch Subscription History
        const subsSnapshot = await adminDb.collection("subscriptions")
            .where("user_id", "==", auth.uid)
            .orderBy("created_at", "desc")
            .get();

        const subscriptions = subsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Fetch user data for tier identification (if Active)
        const userRef = adminDb.collection("users").doc(auth.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : null;

        let activeTierName = "Free";

        if (userData?.subscription_status === "active" && userData?.current_tier_id) {
            const tierRef = adminDb.collection("subscription_tiers").doc(userData.current_tier_id);
            const tierDoc = await tierRef.get();
            if (tierDoc.exists) {
                activeTierName = tierDoc.data()?.name || "Premium";
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                quota: quotaData,
                subscriptions: subscriptions,
                subscriptionStatus: userData?.subscription_status || "free",
                activeTierName: activeTierName
            }
        });

    } catch (error: any) {
        console.error("GET User Subscription Data error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
