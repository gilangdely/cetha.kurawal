"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, FileText, Video, LayoutTemplate } from "lucide-react";
import RichTextEditor from "@/components/admin/rich-text-editor";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContentFormProps {
    id?: string;
    initialData?: any;
}

export function ContentForm({ id, initialData }: ContentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        type: "article",
        title: "",
        slug: "",
        excerpt: "",
        contentHtml: "",
        youtubeUrl: "",
        coverImageUrl: "",
        tags: "",
        status: "draft"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                type: initialData.type || "article",
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                contentHtml: initialData.contentHtml || "",
                youtubeUrl: initialData.youtubeUrl || "",
                coverImageUrl: initialData.coverImageUrl || "",
                tags: (initialData.tags || []).join(", "),
                status: initialData.status || "draft"
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (html: string) => {
        setFormData(prev => ({ ...prev, contentHtml: html }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload = {
                ...formData,
                slug: formData.slug.trim() || undefined,
                contentHtml: formData.type === "video" ? null : formData.contentHtml,
                youtubeUrl: formData.type === "article" ? null : formData.youtubeUrl,
                coverImageUrl: formData.coverImageUrl.trim() || undefined,
                tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean)
            };

            const url = id ? `/api/admin/contents/${id}` : `/api/admin/contents`;
            const method = id ? "PATCH" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok || json.ok === false || json.success === false) {
                throw new Error(json.message || json.error || "Terjadi kesalahan saat menyimpan");
            }

            router.push("/id/admin/contents");
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
                    <Link href="/id/admin/contents">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {id ? "Edit Konten Tips Karir" : "Buat Konten Baru"}
                    </h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        Bekerja sebagai {formData.type === "article" ? "Artikel Teks" : "Vidio YouTube"}
                        <Badge variant="outline" className={`ml-2 font-medium border text-[10px] py-0 ${formData.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600'}`}>
                            {formData.status === 'published' ? 'PUBLISHED' : 'DRAFT'}
                        </Badge>
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setFormData(p => ({ ...p, status: p.status === 'draft' ? 'published' : 'draft' }))}
                        className="font-semibold text-xs border-gray-300 shadow-sm"
                    >
                        {formData.status === 'published' ? 'Jadikan Draft' : 'Set ke Published'}
                    </Button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Kolom Kiri - Utama */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold">Informasi Utama</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 pt-5">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Format Konten</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: "article" }))}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.type === "article" ? "bg-blue-50/50 border-primaryBlue text-primaryBlue shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <FileText size={24} className="mb-2" />
                                        <span className="text-sm font-semibold">Teks Artikel</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: "video" }))}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.type === "video" ? "bg-red-50/50 border-red-500 text-red-600 shadow-sm" : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                                            }`}
                                    >
                                        <Video size={24} className="mb-2" />
                                        <span className="text-sm font-semibold">Vidio YouTube</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Judul Eksak <span className="text-red-500">*</span></label>
                                <Input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="focus-visible:ring-primaryBlue"
                                    placeholder="Contoh: 5 Kesalahan Umum Saat Interview"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Teks Excerpt (Ringkasan Card)</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleChange}
                                    rows={3}
                                    maxLength={250}
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:border-transparent resize-none bg-white placeholder:text-muted-foreground"
                                    placeholder="Tuliskan dua kalimat ringkasan (maksimal 250 karakter)..."
                                />
                                <div className="text-[10px] text-right text-gray-400 font-medium">
                                    {formData.excerpt.length} / 250
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <LayoutTemplate size={18} className="text-gray-400" />
                                Editor {formData.type === "article" ? "Teks Lengkap" : "Embed Vidio"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-5 p-0 sm:p-5">
                            {formData.type === "article" ? (
                                <div className="rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-primaryBlue focus-within:border-transparent transition-shadow">
                                    <RichTextEditor content={formData.contentHtml} onChange={handleEditorChange} />
                                </div>
                            ) : (
                                <div className="space-y-1.5 px-4 sm:px-0">
                                    <label className="text-sm font-medium text-gray-700">Tautan Direct YouTube <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Video className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <Input
                                            type="url"
                                            name="youtubeUrl"
                                            value={formData.youtubeUrl}
                                            onChange={handleChange}
                                            className="pl-10 focus-visible:ring-red-500"
                                            placeholder="https://www.youtube.com/watch?v=..."
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Masukkan URL penuh YouTube, sistem otomatis me-render iframenya.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Kolom Kanan - Meta & Pengaturan Lanjut */}
                <div className="space-y-6">
                    <Card className="rounded-xl border-gray-200 shadow-sm">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-gray-500">Metadata Publikasi</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">URL Slug Unik (Auto)</label>
                                <Input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="font-mono text-xs text-gray-600 bg-gray-50 shadow-inner focus-visible:ring-primaryBlue placeholder:italic"
                                    placeholder="Biarkan kosong agar di-generate"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">URL Gambar Sampul</label>
                                <Input
                                    type="url"
                                    name="coverImageUrl"
                                    value={formData.coverImageUrl}
                                    onChange={handleChange}
                                    className="text-sm focus-visible:ring-primaryBlue"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-700">Tag (Koma Pemisah)</label>
                                <Input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="text-sm focus-visible:ring-primaryBlue"
                                    placeholder="frontend, javascript, resume"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-xl shadow-lg border-2 border-primaryBlue/10 bg-blue-50/30">
                        <CardContent className="p-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primaryBlue hover:bg-blue-700 text-white shadow-md rounded-lg py-6 font-semibold transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Simpan Perubahan Database
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    );
}
