import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { subscriptionTierSchema } from "@/types/subscription-schema";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: Request) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const snapshot = await adminDb.collection("subscription_tiers").orderBy("display_order", "asc").get();
        const tiers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, data: tiers });
    } catch (error: any) {
        console.error("GET Admin Subscription Tiers error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const body = await req.json();
        const parsed = subscriptionTierSchema.parse(body);

        // check unique slug
        const slugCheck = await adminDb.collection("subscription_tiers").where("slug", "==", parsed.slug).get();
        if (!slugCheck.empty) {
            return NextResponse.json({ ok: false, message: "Slug sudah digunakan" }, { status: 400 });
        }

        const newDoc = {
            ...parsed,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        // If is_recommended is true, update other tiers to false within a transaction
        let docRefId = "";
        if (parsed.is_recommended) {
            await adminDb.runTransaction(async (transaction) => {
                const recommendedCheck = await adminDb.collection("subscription_tiers").where("is_recommended", "==", true).get();
                recommendedCheck.forEach(doc => {
                    transaction.update(doc.ref, { is_recommended: false, updatedAt: FieldValue.serverTimestamp() });
                });

                const docRef = adminDb.collection("subscription_tiers").doc();
                transaction.set(docRef, newDoc);
                docRefId = docRef.id;
            });
        } else {
            const docRef = await adminDb.collection("subscription_tiers").add(newDoc);
            docRefId = docRef.id;
        }

        return NextResponse.json({ success: true, id: docRefId });
    } catch (error: any) {
        console.error("POST Admin Subscription Tiers error:", error);

        let message = error.message;
        if (error.issues) {
            message = error.issues.map((i: any) => i.message).join(", ");
        }

        return NextResponse.json({ ok: false, message, issues: error.issues }, { status: 400 });
    }
}
