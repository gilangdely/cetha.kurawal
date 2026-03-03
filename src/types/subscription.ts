export interface SubscriptionTier {
    id?: string;
    name: string;
    slug: string;
    price: number;
    quota_amount: number;
    description: string;
    features: string[];
    currency: string;
    is_active: boolean;
    display_order: number;
    is_recommended?: boolean;
    created_at?: string;
    updated_at?: string;
}

export type SubscriptionStatus = 'pending' | 'verified' | 'rejected';

export interface Subscription {
    id?: string;
    user_id: string;
    tier_id: string;
    invoice_number: string;
    amount: number;
    status: SubscriptionStatus;
    payment_proof_url: string;
    verified_at?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserQuota {
    id?: string;
    user_id: string;
    total_quota: number;
    used_quota: number;
    remaining_quota: number;
    updated_at?: string;
}

export interface UsageLog {
    id?: string;
    user_id: string; // "guest_IP" if guest
    feature_name: string;
    quota_used: number;
    created_at: string;
}
