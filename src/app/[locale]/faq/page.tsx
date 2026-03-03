import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Pertanyaan yang Sering Diajukan (FAQ) | Cetha",
    description: "Temukan jawaban cepat atas kendala CV, Akun, dan Karir di platform Cetha Kurawal.",
};

const FAQ_ITEMS = [
    {
        question: "Apa itu platform Cetha Kurawal?",
        answer: "Cetha Kurawal adalah portal Karir masa depan yang digerakkan oleh kecerdasan buatan (Gen-AI). Di sini kamu bisa mendapatkan validasi Curriculum Vitae secara instan, tips optimasi LinkedIn, serta pustaka edukasi gratis seputar taktik lamaran kerja.",
    },
    {
        question: "Apakah sepenuhnya gratis alias tanpa bayar?",
        answer: "Betul! Sebagian besar fitur esensial seperti Review CV Standar dan Modul Tips Karir disediakan bebas biaya. Kami mensubsidi ongkos AI harian demi mendukung karir talenta digital Indonesia.",
    },
    {
        question: "Bagaimana cara melakukan review CV?",
        answer: "Sangat mudah. Kamu cukup mendaftar/login di platform kami, arahkan ke menu 'CV Review' dari Dashboard, lalu unggah dokumen PDF/Word kamu. Dalam hitungan detik, CethaBot akan mengeluarkan skor kualitas serta saran konstruktif untuk setiap bait kalimat CV-mu.",
    },
    {
        question: "Apakah jaminan aman untuk data pribadi saya?",
        answer: "Privasimu dienkripsi 100%. Kami tidak menyimpan salinan fisik dokumenmu di database tanpa izin. AI hanya sekadar membaca ekstrak teksmu dalam hitungan mikrodetik, lalu langsung dibumi-hanguskan dari memori pemrosesan AI.",
    },
    {
        question: "Output review-nya berwujud apa?",
        answer: "Bentuk evaluasinya mencakup skor numerik (0-100), poin kebaikan (Good Things) yang sudah tersemat di CV-mu, dan kritik poin krusial (Need Improvements) beserta koreksi redaksional kalimat mana yang lemah di mata HRD.",
    },
    {
        question: "Apakah layanan Cetha bisa menampung segala jurusan kuliah?",
        answer: "Tentu! Walaupun arsitekturnya difokuskan untuk tech/business talent, pondasi Prompt buatan Cetha tetap relevan menaksir CV dari bidang sosial, medikal, keilmuan bahasa, ataupun sastra seni sekalipun.",
    },
    {
        question: "Di mana saya bisa mulai membaca Tips Karir?",
        answer: "Setelah login, kamu bisa menuju ke sisi kiri layar (Sidebar navigasi), lalu mengklik 'Artikel & Video'. Di sana tersaji ragam konten eksklusif yang ditulis oleh tim kurasi kami.",
    },
    {
        question: "Bagaimana tata cara menghubungi tim Support sesungguhnya?",
        answer: "Kamu bisa bertamu kapan pun ke menu 'Hubungi Kami' yang tersemat pada tautan footer di bagian paling bawah halaman, atau sekadar melempar direct mail ke alamat support@cetha.id.",
    },
];

export default function FAQPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50/50 pt-32 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-10">

                    <div className="text-center space-y-4 mb-4">
                        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-xs font-bold tracking-wider uppercase mb-2">Bantuan Terpadu</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Kompilasi FAQ</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Mulai dari teknis Artificial Intelligence hingga jaminan keamanan privasi. Temukan jalan pintas atas kegelisahan operasionalmu di sini.
                        </p>
                    </div>

                    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden bg-white">
                        <CardContent className="p-6 md:p-10">
                            <Accordion type="single" collapsible className="w-full space-y-4">
                                {FAQ_ITEMS.map((item, index) => (
                                    <AccordionItem
                                        key={index}
                                        value={`item-${index}`}
                                        className="border rounded-xl px-5 py-1 bg-white hover:bg-gray-50/50 shadow-sm transition-colors data-[state=open]:bg-blue-50/30 data-[state=open]:border-blue-200"
                                    >
                                        <AccordionTrigger className="text-left font-semibold text-[15px] sm:text-base text-gray-800 hover:no-underline">
                                            {item.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-gray-600 leading-relaxed pt-2 pb-4">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>

                </div>
            </main>
            <Footer />
        </>
    );
}
