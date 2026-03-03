import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Syarat & Ketentuan | Cetha",
    description: "Syarat dan Ketentuan layanan platform eksplorasi karir dan review CV Cetha Kurawal.",
};

const SECTIONS = [
    {
        title: "1. Definisi layanan",
        content: "Cetha (disebut 'Kami') adalah platform berbasis kecerdasan buatan (Artifical Intelligence) yang memberi wawasan analisis kelayakan CV, bimbingan profil tersemat pada LinkedIn, dan modul persiapan menuju dunia karir operasional penuh. Produk layanan dilisensikan melalui platform web untuk publik terbatas."
    },
    {
        title: "2. Akun & akses",
        content: "Boleh jadi layanan ini mengharuskan peresmian akun lewat registrasi. Pengguna setuju memberikan kredensial absah dan bertindak menjaga kepemilikan sandinya. Kami tidak memikul kelalaian yang lahir jika otoritas akun Anda dikuasai kriminal di luar wewenang kami."
    },
    {
        title: "3. Penggunaan yang dilarang",
        content: "Harap dilarang mengeksekusi hacking (retas balik), ekstraksi scraping/crawling terhadap web secara ilegal, melipatgandakan produk komersial web tanpa kemitraan, merekayasa prompt injection kepada Chatbot AI, ataupun spam berlebihan."
    },
    {
        title: "4. Konten pengguna",
        content: "Pengguna secara eksklusif memegang hak kekayaan intelektual atas riwayat CV-nya sendiri. Adapun konten umpan balik/resultase AI milik kami adalah hasil rumusan yang sah untuk dipakai referensi pribadi pengguna. Dilarang menerbitkan kompilasi output Cetha secara makro mendesain tiruan model serupa."
    },
    {
        title: "5. Disclaimer hasil AI",
        content: "Ingatlah ini di kepala Anda: Algoritma Kecerdasan Buatan kami BERSIFAT KONSULTATIF, bukan fatwa hukum HR Mutlak. Kami tidak bergaransi bahwa mematuhi perbaikan AI pasti akan lolos interview/HRD. Semua proses bergantung sepenuhnya ketetapan eksklusif rekruiter serta relevansi keaslian data talenta pengikutnya."
    },
    {
        title: "6. Batasan tanggung jawab",
        content: "Kami dilepaskan dari gugatan finansial, moral, maupun sosial di atas kompensasi kehilangan momentum atau gagal mendapat proyek ketenagakerjaan spesifik. Segala eksekusi lapangan bertumpu di tangan Anda."
    },
    {
        title: "7. Perubahan layanan",
        content: "Fokus kami terus ber-evolusi demi kualitas yang terintegrasi. Hal ini mewajarkan apabila kami dalam hitungan jam mendadak mengubah spesifikasi tools, menihilkan fitur kuno, atau melahirkan batasan frekuensi tanpa diumumkan ekstensif kepada klien gratis."
    },
    {
        title: "8. Hukum yang berlaku",
        content: "Hubungan hierarkis antara platform dengan konsumennya mematuhi kedaulatan yurisdiksi dan konstitusi hukum perdata eksisting wilayah yurisdiksi Republik Indonesia tempat server beroperasi."
    },
];

export default function SyaratKetentuanPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50/50 pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold tracking-wider uppercase mb-2">Legal Basis</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Syarat & Ketentuan</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Panduan hukum bagi kita bersama. Dengan menelusuri atau mengoperasikan layanan kami, Anda menyatakan persetujuan mutlak atas dokumen di bawah ini.
                        </p>
                    </div>

                    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 mb-8 leading-relaxed font-medium">
                                    Revisi Dokumen Terakhir: 1 Januari 2026.
                                </p>

                                <div className="space-y-8">
                                    {SECTIONS.map((section, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <h2 className="text-[1.15rem] font-bold text-gray-900 border-b pb-2">
                                                {section.title}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed text-[15px]">
                                                {section.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </main>
            <Footer />
        </>
    );
}
