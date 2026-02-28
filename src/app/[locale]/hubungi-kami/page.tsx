"use client";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Clock, MapPin, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Shadcn sonner is installed

export default function HubungiKamiPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulasi network request delay
        setTimeout(() => {
            setLoading(false);
            toast.success("Pesan Terkirim (Demo)!", {
                description: "Halo masbro, pesanmu berhasil ditangkap sistem! (Ingat, ini versi demo ya, backend-nya tidak memproses email aslinya)."
            });
            // reset form here if needed
            (e.target as HTMLFormElement).reset();
        }, 800);
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-5xl mx-auto">

                    <div className="text-center space-y-4 mb-14">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Hubungi Kami</h1>
                        <p className="text-lg text-muted-foreground flex justify-center max-w-xl mx-auto">
                            Ingin bertanya tentang algoritma AI, melaporkan seputar error CV, atau hanya berniat say hi lintas pulau? Tim kami bersiaga di sini!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Kiri: Informasi Kontak Samping */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="rounded-2xl border-gray-100 shadow-sm bg-blue-50/50">
                                <CardContent className="p-8 space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Info Komunikasi</h3>

                                    <div className="space-y-5">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white p-3 rounded-full shadow-sm">
                                                <Mail size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Alamat Surat Elektronik</p>
                                                <a href="mailto:support@cetha.id" className="text-blue-600 hover:underline text-sm font-medium mt-1 inline-block">support@cetha.id</a>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="bg-white p-3 rounded-full shadow-sm">
                                                <Clock size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Jam Operasional Tim</p>
                                                <p className="text-gray-600 text-sm mt-1">Senin – Jumat<br />09.00 – 17.00 WIB</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4">
                                            <div className="bg-white p-3 rounded-full shadow-sm">
                                                <MapPin size={20} className="text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">Markas Beroperasi</p>
                                                <p className="text-gray-600 text-sm mt-1">Gedung Sudirman Lantai 4,<br />Jakarta Pusat, ID 10220</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 mt-6 border-t border-gray-200">
                                        <p className="text-xs text-gray-500 font-medium mb-3">Butuh ditangani lebih gegas?</p>
                                        <Button asChild variant="outline" className="w-full justify-between items-center group hover:bg-white hover:text-blue-700">
                                            <a href="mailto:support@cetha.id">
                                                Kirim via Email Konvensional
                                                <ExternalLink size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                            </a>
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        </div>

                        {/* Kanan: Form Eksekutif */}
                        <div className="lg:col-span-3">
                            <Card className="rounded-2xl border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-full">
                                <CardContent className="p-8 sm:p-10">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        Surat Digital Anda <span className="text-2xl">✉️</span>
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Nama Panggilan Berkelas Anda</label>
                                                <Input required type="text" placeholder="John Doe" className="focus-visible:ring-primaryBlue" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-700">Alamat Email Penerima Balasan</label>
                                                <Input required type="email" placeholder="john@example.com" className="focus-visible:ring-primaryBlue" />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Perihal / Subjek Pembicaraan</label>
                                            <Input required type="text" placeholder="Kendala Bug di Layar Resume" className="focus-visible:ring-primaryBlue" />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-gray-700">Pesan Keluh Kesah atau Saran</label>
                                            <Textarea required rows={6} placeholder="Tulis rincian mendalam disini..." className="resize-none focus-visible:ring-primaryBlue" />
                                        </div>

                                        <Button type="submit" disabled={loading} className="w-full bg-primaryBlue hover:bg-blue-700 py-6 rounded-xl font-semibold justify-center gap-2 text-[15px] mt-4 shadow-md transition-all disabled:opacity-75">
                                            {loading ? (
                                                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                                            ) : (
                                                <>Kirim Menuju Server <Send size={18} /></>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                    </div>

                </div>
            </main>
            <Footer />
        </>
    );
}
