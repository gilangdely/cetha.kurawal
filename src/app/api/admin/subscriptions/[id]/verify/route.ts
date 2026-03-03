import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const id = (await params).id;

        // 1. Run inside a transaction to ensure atomicity
        await adminDb.runTransaction(async (transaction) => {
            const subscriptionRef = adminDb.collection("subscriptions").doc(id);
            const subDoc = await transaction.get(subscriptionRef);

            if (!subDoc.exists) {
                throw new Error("Transaksi tidak ditemukan.");
            }

            const subData = subDoc.data()!;

            if (subData.status !== "pending") {
                throw new Error(`Transaksi sudah diproses. Status saat ini: ${subData.status}`);
            }

            // 2. Get Tier Data to know quota amount
            const tierRef = adminDb.collection("subscription_tiers").doc(subData.tier_id);
            const tierDoc = await transaction.get(tierRef);

            if (!tierDoc.exists) {
                throw new Error("Tier langganan tidak valid atau telah dihapus.");
            }

            const tierData = tierDoc.data()!;
            const quotaToAdd = tierData.quota_amount;

            // 3. Update User Quotas
            const quotaRef = adminDb.collection("user_quotas").doc(subData.user_id);
            const quotaDoc = await transaction.get(quotaRef);

            if (quotaDoc.exists) {
                const currentQuota = quotaDoc.data()!.remaining_quota || 0;
                const newTotalQuota = (quotaDoc.data()!.total_quota || 0) + quotaToAdd;
                const newRemaining = currentQuota + quotaToAdd;

                transaction.update(quotaRef, {
                    total_quota: newTotalQuota,
                    remaining_quota: newRemaining,
                    updated_at: FieldValue.serverTimestamp()
                });
            } else {
                // First time getting a quota
                transaction.set(quotaRef, {
                    user_id: subData.user_id,
                    total_quota: quotaToAdd,
                    used_quota: 0,
                    remaining_quota: quotaToAdd,
                    updated_at: FieldValue.serverTimestamp()
                });
            }

            // 4. Update the subscription status
            transaction.update(subscriptionRef, {
                status: "verified",
                verified_at: FieldValue.serverTimestamp(),
                updated_at: FieldValue.serverTimestamp()
            });

            // 5. Optionally update the primary user record
            const userRef = adminDb.collection("users").doc(subData.user_id);
            transaction.update(userRef, {
                subscription_status: "active",
                current_tier_id: subData.tier_id,
                updatedAt: FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({ success: true, message: "Pembayaran berhasil diverifikasi & Kuota bertambah." });

    } catch (error: any) {
        console.error("POST Verify Subscription error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
