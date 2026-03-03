"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubscriptionTierForm } from "@/components/admin/subscription-tier-form";

export default function EditSubscriptionTierPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/admin/subscription-tiers/${id}`);
                const data = await res.json();
                if (data.success) {
                    setInitialData(data.data);
                } else {
                    router.push("/id/admin/subscription-tiers");
                }
            } catch (error) {
                console.error("Error fetching tier", error);
                router.push("/id/admin/subscription-tiers");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primaryBlue" />
            </div>
        );
    }

    return <SubscriptionTierForm id={id} initialData={initialData} />;
}
