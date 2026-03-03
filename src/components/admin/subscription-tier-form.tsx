"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubscriptionTierFormProps {
    id?: string;
    initialData?: any;
}

export function SubscriptionTierForm({ id, initialData }: SubscriptionTierFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: 0,
        quota_amount: 0,
        description: "",
        currency: "IDR",
        is_active: true,
        is_recommended: false,
        display_order: 0,
    });
    const [features, setFeatures] = useState<string[]>([""]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                slug: initialData.slug || "",
                price: initialData.price || 0,
                quota_amount: initialData.quota_amount || 0,
                description: initialData.description || "",
                currency: initialData.currency || "IDR",
                is_active: initialData.is_active ?? true,
                is_recommended: initialData.is_recommended ?? false,
                display_order: initialData.display_order || 0,
            });
            if (initialData.features && initialData.features.length > 0) {
                setFeatures(initialData.features);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = value;
        setFeatures(newFeatures);
    };

    const addFeature = () => {
        setFeatures([...features, ""]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = features.filter((_, i) => i !== index);
        setFeatures(newFeatures.length > 0 ? newFeatures : [""]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const filteredFeatures = features.filter(f => f.trim() !== "");

            if (filteredFeatures.length === 0) {
                throw new Error("Tier harus memiliki setidaknya satu fitur");
            }

            const payload = {
                ...formData,
                price: Number(formData.price),
                quota_amount: Number(formData.quota_amount),
                display_order: Number(formData.display_order),
                features: filteredFeatures,
            };

            const url = id ? `/api/admin/subscription-tiers/${id}` : `/api/admin/subscription-tiers`;
            const method = id ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok || json.ok === false || json.success === false) {
                throw new Error(json.message || json.error || "Terjadi kesalahan saat menyimpan");
            }

            router.push("/id/admin/subscription-tiers");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-gray-100">
                    <Link href="/id/admin/subscription-tiers">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {id ? "Edit Subscription Tier" : "Buat Subscription Tier Baru"}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Atur harga, kuota, dan fitur yang didapatkan user.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold">Informasi Dasar</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Nama Tier <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Contoh: Beginner"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Slug <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        placeholder="Contoh: beginner-tier"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label>Harga (IDR) <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        type="number"
                                        min="0"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Tambahan Kuota <span className="text-red-500">*</span></Label>
                                    <Input
                                        required
                                        type="number"
                                        min="0"
                                        name="quota_amount"
                                        value={formData.quota_amount}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label>Deskripsi / Tagline</Label>
                                <Input
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Contoh: Cocok untuk fresh graduate yang ingin revisi CV."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold">Daftar Fitur (Benefits)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-5">
                            {features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <Input
                                        value={feature}
                                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                                        placeholder={`Fitur ${index + 1}`}
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeFeature(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFeature}
                                className="mt-2 text-primaryBlue flex items-center gap-2"
                            >
                                <Plus size={14} /> Tambah Fitur
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold">Pengaturan Tambahan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <div className="flex items-center justify-between border border-gray-100 p-3 rounded-lg">
                                <Label className="text-sm font-medium cursor-pointer" htmlFor="is-active">Status Aktif</Label>
                                <Switch
                                    id="is-active"
                                    checked={formData.is_active}
                                    onCheckedChange={(val) => setFormData(p => ({ ...p, is_active: val }))}
                                />
                            </div>

                            <div className="flex items-center justify-between border border-gray-100 p-3 rounded-lg">
                                <div>
                                    <Label className="text-sm font-medium cursor-pointer block" htmlFor="is-recommended">Paling Direkomendasikan</Label>
                                    <p className="text-xs text-gray-500 mt-0.5">Hanya 1 tier yang bisa direkomendasikan.</p>
                                </div>
                                <Switch
                                    id="is-recommended"
                                    checked={formData.is_recommended}
                                    onCheckedChange={(val) => setFormData(p => ({ ...p, is_recommended: val }))}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-sm font-medium text-gray-700">Urutan Tampil</Label>
                                <Input
                                    required
                                    type="number"
                                    name="display_order"
                                    value={formData.display_order}
                                    onChange={handleChange}
                                    className="text-sm focus-visible:ring-primaryBlue"
                                />
                                <p className="text-xs text-gray-500">Angka lebih kecil tampil lebih dulu dari kiri.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primaryBlue hover:bg-blue-700 text-white shadow-md rounded-lg py-6 font-semibold transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                        ) : (
                            <>
                                <Save size={18} />
                                Simpan Tier
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
