import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase-admin";
import { requireAdmin } from "@/app/lib/session";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    try {
        const id = (await params).id;

        // Wrap in transaction just to be safe it hasn't been verified since fetching
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

            // Reject the transaction
            transaction.update(subscriptionRef, {
                status: "rejected",
                updated_at: FieldValue.serverTimestamp()
            });

            // Create Notification for User
            const notifRef = adminDb.collection("notifications").doc();
            transaction.set(notifRef, {
                recipientId: subData.user_id,
                title: "Pembayaran Ditolak",
                message: `Pembayaran Anda (Invoice: ${subData.invoice_number}) ditolak oleh Admin. Silakan hubungi dukungan pelanggan atau unggah ulang bukti yang valid.`,
                type: "payment_update",
                isRead: false,
                link: `/dashboard/transactions?invoice=${subData.invoice_number}`,
                createdAt: FieldValue.serverTimestamp()
            });
        });

        return NextResponse.json({ success: true, message: "Pembayaran ditolak." });

    } catch (error: any) {
        console.error("POST Reject Subscription error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
