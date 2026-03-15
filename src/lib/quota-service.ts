import { adminDb } from "@/app/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Feature costs in tokens.
 */
export const FEATURE_COSTS: Record<string, number> = {
    "CV Review": 25,
    "Job Match": 20,
    "Improve LinkedIn": 15,
    "Generate Target": 5,
    "Chat Bot": 5,
    "Generate CV": 2,
};

/**
 * Service to manage user quotas and guest (IP-based) quotas.
 */
export class QuotaService {
    /**
     * Checks if a user or guest has remaining quota based on the feature cost.
     */
    static async checkQuota(
        userId: string | null,
        ipAddress: string,
        featureName: string = "CV Review"
    ): Promise<{ hasQuota: boolean; message?: string }> {
        const cost = FEATURE_COSTS[featureName] || 0;

        if (userId) {
            // Check User Token Quota
            const quotaRef = adminDb.collection("user_quotas").doc(userId);
            const quotaDoc = await quotaRef.get();

            if (!quotaDoc.exists) {
                // Give default free quota if document doesn't exist (e.g. 50 tokens for new users)
                return { hasQuota: true };
            }

            const remaining = quotaDoc.data()?.remaining_quota || 0;
            if (remaining >= cost) {
                return { hasQuota: true };
            }

            return { 
                hasQuota: false, 
                message: "Token kamu tidak cukup untuk fitur ini. Silakan top-up atau upgrade paket langganan untuk melanjutkan." 
            };
        } else {
            // Check Guest Quota by IP (Standard 1 free usage for guests)
            const guestRef = adminDb.collection("guest_usage").doc(ipAddress.replace(/[:.]/g, "_"));
            const guestDoc = await guestRef.get();

            if (!guestDoc.exists) {
                return { hasQuota: true };
            }

            const used = guestDoc.data()?.used_quota || 0;
            if (used < 1) {
                return { hasQuota: true };
            }

            return { hasQuota: false, message: "Batas penggunaan tamu telah habis. Silakan login atau daftar untuk mendapatkan token gratis." };
        }
    }

    /**
     * Consumes tokens from a user or guest and logs the usage.
     */
    static async consumeQuota(userId: string | null, featureName: string, ipAddress: string): Promise<void> {
        const cost = FEATURE_COSTS[featureName] || 0;

        await adminDb.runTransaction(async (transaction) => {
            const logRef = adminDb.collection("usage_logs").doc();

            if (userId) {
                // 1. Read User Quota First
                const quotaRef = adminDb.collection("user_quotas").doc(userId);
                const quotaDoc = await transaction.get(quotaRef);

                // 2. Write operations
                transaction.set(logRef, {
                    user_id: userId,
                    ip_address: ipAddress,
                    feature: featureName,
                    token_cost: cost,
                    created_at: FieldValue.serverTimestamp()
                });

                if (quotaDoc.exists) {
                    const currentRemaining = quotaDoc.data()?.remaining_quota || 0;
                    const currentUsed = quotaDoc.data()?.used_quota || 0;

                    if (currentRemaining < cost) {
                        throw new Error("Insufficient token quota");
                    }

                    transaction.update(quotaRef, {
                        remaining_quota: currentRemaining - cost,
                        used_quota: currentUsed + cost,
                        updated_at: FieldValue.serverTimestamp()
                    });
                } else {
                    // Create default free quota minus cost
                    const initialTokens = 50; 
                    transaction.set(quotaRef, {
                        user_id: userId,
                        total_quota: initialTokens,
                        used_quota: cost,
                        remaining_quota: initialTokens - cost,
                        updated_at: FieldValue.serverTimestamp()
                    });
                }
            } else {
                // 1. Read Guest Quota First
                const guestId = ipAddress.replace(/[:.]/g, "_");
                const guestRef = adminDb.collection("guest_usage").doc(guestId);
                const guestDoc = await transaction.get(guestRef);

                // 2. Write operations
                transaction.set(logRef, {
                    user_id: "guest",
                    ip_address: ipAddress,
                    feature: featureName,
                    token_cost: 0, // Guests consume "uses", not tokens directly for simplicity
                    created_at: FieldValue.serverTimestamp()
                });

                if (guestDoc.exists) {
                    const currentUsed = guestDoc.data()?.used_quota || 0;
                    if (currentUsed >= 1) {
                        throw new Error("Insufficient guest quota");
                    }
                    transaction.update(guestRef, {
                        used_quota: currentUsed + 1,
                        last_used: FieldValue.serverTimestamp()
                    });
                } else {
                    transaction.set(guestRef, {
                        ip_address: ipAddress,
                        used_quota: 1,
                        last_used: FieldValue.serverTimestamp()
                    });
                }
            }
        });
    }
}
