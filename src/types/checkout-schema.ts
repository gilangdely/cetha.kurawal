import { z } from "zod";

export const checkoutSchema = z.object({
    tier_id: z.string().min(1, "Tier tidak valid"),
    payment_proof_url: z.string().url("URL bukti pembayaran tidak valid"),
});
