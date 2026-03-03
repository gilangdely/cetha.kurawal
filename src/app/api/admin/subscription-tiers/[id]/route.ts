import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { subscriptionTierSchema } from "@/types/subscription-schema";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const id = (await params).id;
        const docRef = adminDb.collection("subscription_tiers").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ success: false, error: "Tier not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: { id: docSnap.id, ...docSnap.data() } });
    } catch (error: any) {
        console.error("GET Admin Subscription Tier error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const id = (await params).id;
        const body = await req.json();
        const parsed = subscriptionTierSchema.parse(body);

        const docRef = adminDb.collection("subscription_tiers").doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            return NextResponse.json({ success: false, error: "Tier not found" }, { status: 404 });
        }

        // check unique slug
        if (parsed.slug !== docSnap.data()?.slug) {
            const slugCheck = await adminDb.collection("subscription_tiers").where("slug", "==", parsed.slug).get();
            if (!slugCheck.empty) {
                return NextResponse.json({ ok: false, message: "Slug sudah digunakan" }, { status: 400 });
            }
        }

        const updateData = {
            ...parsed,
            updatedAt: FieldValue.serverTimestamp(),
        };

        // If is_recommended is true, update other tiers to false within a transaction
        if (parsed.is_recommended && !docSnap.data()?.is_recommended) {
            await adminDb.runTransaction(async (transaction) => {
                const recommendedCheck = await adminDb.collection("subscription_tiers")
                    .where("is_recommended", "==", true)
                    .get();

                recommendedCheck.forEach(doc => {
                    if (doc.id !== id) {
                        transaction.update(doc.ref, { is_recommended: false, updatedAt: FieldValue.serverTimestamp() });
                    }
                });

                transaction.update(docRef, updateData);
            });
        } else {
            await docRef.update(updateData);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("PUT Admin Subscription Tier error:", error);
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
        const id = (await params).id;
        const docRef = adminDb.collection("subscription_tiers").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return NextResponse.json({ success: false, error: "Tier not found" }, { status: 404 });
        }

        await docRef.delete();

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("DELETE Admin Subscription Tier error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
