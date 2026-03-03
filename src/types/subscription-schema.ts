import { z } from "zod";

export const subscriptionTierSchema = z.object({
    name: z.string().min(1, "Nama tier wajib diisi"),
    slug: z.string().min(1, "Slug wajib diisi"),
    price: z.coerce.number().min(0, "Harga tidak valid"),
    quota_amount: z.coerce.number().min(0, "Kuota tidak valid"),
    description: z.string().optional(),
    features: z.array(z.string()).default([]),
    currency: z.string().default("IDR"),
    is_active: z.boolean().default(true),
    is_recommended: z.boolean().default(false),
    display_order: z.coerce.number().default(0),
});
