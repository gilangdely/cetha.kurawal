"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit, Trash2, Globe, EyeOff, FileText, Video, MoreHorizontal, Inbox } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface ContentItem {
    id: string;
    title: string;
    type: "article" | "video";
    status: "draft" | "published";
    createdAt: { _seconds: number };
}

export default function AdminContentsPage() {
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    const loadContents = async () => {
        setLoading(true);
        try {
            const url = new URL("/api/admin/contents", window.location.origin);
            if (typeFilter !== "all") url.searchParams.append("type", typeFilter);

            const res = await fetch(url.toString());
            if (res.ok) {
                const json = await res.json();
                setContents(json.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContents();
    }, [typeFilter]);

    const togglePublish = async (id: string, currentStatus: string) => {
        const action = currentStatus === "published" ? "unpublish" : "publish";
        try {
            await fetch(`/api/admin/contents/${id}/${action}`, { method: "POST" });
            loadContents();
        } catch (e) {
            console.error(e);
        }
    };

    const deleteContent = async (id: string) => {
        if (!confirm("Yakin ingin menghapus konten ini secara permanen?")) return;
        try {
            await fetch(`/api/admin/contents/${id}`, { method: "DELETE" });
            loadContents();
        } catch (e) {
            console.error(e);
        }
    };

    const filteredContents = contents.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const formatDate = (seconds?: number) => {
        if (!seconds) return "-";
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date(seconds * 1000));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Daftar Konten Tip Karir</h1>
                    <p className="text-muted-foreground text-sm mt-1">Buat, kelola, dan publikasikan artikel atau vidio tutorial.</p>
                </div>
                <Button asChild className="bg-primaryBlue hover:bg-blue-700 shadow-sm gap-2">
                    <Link href="/id/admin/contents/new">
                        <PlusCircle size={16} />
                        Konten Baru
                    </Link>
                </Button>
            </div>

            <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Cari berdasarkan judul..."
                                className="w-full pl-9 pr-4 py-2 text-sm border-gray-200 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 text-sm border-gray-200 border rounded-md outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">Semua Format</option>
                            <option value="article">Format Artikel HTML</option>
                            <option value="video">Format Vidio YouTube</option>
                        </select>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider pl-6">Detail Judul</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider w-[120px]">Tipe</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider w-[120px]">Status</TableHead>
                                <TableHead className="font-semibold text-gray-700 text-xs uppercase tracking-wider w-[150px]">Dibuat Pada</TableHead>
                                <TableHead className="text-right font-semibold text-gray-700 text-xs uppercase tracking-wider pr-6 w-[80px]">Opsi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center space-y-3">
                                            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primaryBlue" />
                                            <span className="text-sm font-medium">Memuat pangkalan data...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredContents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-48 text-center text-gray-500 bg-gray-50/30">
                                        <div className="flex flex-col flex-center items-center justify-center space-y-3">
                                            <Inbox className="h-10 w-10 text-gray-300" />
                                            <p className="text-sm font-medium">Data konten belum tersedia.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredContents.map((item) => (
                                    <TableRow key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <TableCell className="pl-6 font-medium text-gray-900">
                                            {item.title}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                {item.type === "article" ? <FileText size={14} className="text-blue-500" /> : <Video size={14} className="text-red-500" />}
                                                <span className="capitalize text-sm font-medium">{item.type}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`font-semibold text-xs border ${item.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"
                                                }`}>
                                                {item.status === "published" ? "Published" : "Draft"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(item.createdAt?._seconds)}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0" title="Aksi">
                                                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg">
                                                    <DropdownMenuItem className="cursor-pointer" onClick={() => togglePublish(item.id, item.status)}>
                                                        {item.status === "published" ? (
                                                            <><EyeOff className="mr-2 h-4 w-4 text-orange-600" /> Tarik ke Draft</>
                                                        ) : (
                                                            <><Globe className="mr-2 h-4 w-4 text-green-600" /> Publikasikan</>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="cursor-pointer" asChild>
                                                        <Link href={`/id/admin/contents/${item.id}/edit`}>
                                                            <Edit className="mr-2 h-4 w-4 text-primaryBlue" /> Edit Konten
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="cursor-pointer focus:bg-red-50 focus:text-red-600" onClick={() => deleteContent(item.id)}>
                                                        <Trash2 className="mr-2 h-4 w-4 text-red-500" /> <span className="text-red-600 font-medium">Hapus Data</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
