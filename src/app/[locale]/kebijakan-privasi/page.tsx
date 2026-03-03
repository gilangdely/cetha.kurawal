import { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
    title: "Kebijakan Privasi | Cetha",
    description: "Kebijakan Privasi platform Cetha Kurawal terkait pengelolaan data diri pengguna.",
};

const SECTIONS = [
    {
        title: "Data yang kami kumpulkan",
        content: "Kami memproses data dasar seperti nama, alamat email, URL LinkedIn, dan metadata Curriculum Vitae (CV) Anda yang diunggah secara sukarela melalui platform kami. Kami tidak mengumpulkan data sensitif seperti ras, orientasi seksual, informasi kesehatan, atau nomor identitas nasional (KTP/Paspor)."
    },
    {
        title: "Cara kami menggunakan data",
        content: "Data CV maupun profil LinkedIn Anda digunakan murni oleh model bahasa (AI) kami untuk memberikan umpan balik korektif (review) dan pencocokan rekomendasi pekerjaan. Kami tidak menjual aset data Anda kepada pengiklan, calo penyalur kerja, atau pihak eksternal manapun."
    },
    {
        title: "Penyimpanan & keamanan",
        content: "Kami berorientasi pada Security by Design. Seluruh transmisi dienkripsi dengan HTTPS/TLS. Dokumen CV pengguna ditransmisikan secara tertutup menggunakan token otorisasi eksklusif, diawasi oleh layanan cloud security termutakhir bawaan platform."
    },
    {
        title: "Cookies",
        content: "Kami menempatkan Cookies analitik dan fungsional agar proses Autentikasi sesi Anda berstatus permanen sekaligus memantau trafik metrik kunjungan page untuk penyesuaian kualitas antarmuka platform ke depannya."
    },
    {
        title: "Pihak ketiga (Google Login & AI Provider)",
        content: "Ketika Anda melakukan 'Sign in With Google', token sesi pertukaran data dasar diatur selaras dengan standar Oauth 2.0 milik Firebase. Selama siklus pemrosesan file teks AI, kami meminjam kemampuan Google Gemini Pro secara komputasi awan. Provider AI menaati etika zero-retention (tidak memakai prompt user untuk melatih model publik)."
    },
    {
        title: "Hak pengguna",
        content: "Berdasarkan pedoman perundang-undangan perlindungan data (UU PDP), Anda berhak meninjau, mengunduh salinan data pribadi Anda, atau segera mencabut status registrasi lalu menuntut agar seluruh profil akun terhapus (Right to be Forgotten)."
    },
    {
        title: "Perubahan kebijakan",
        content: "Cetha berhak untuk kapan pun menyesuaikan deklarasi Privasi ini manakala diposisikan pada perubahan skema arsitektur. Pengguna terdaftar akan memperoleh surel jika dampak modifikasinya radikal."
    },
    {
        title: "Hubungi Kami",
        content: "Gelisah terhadap nasib privasimu? Silakan kontak kami lewat support@cetha.id kapanpun. Kami dengan senang hati akan transparan mendeskripsikannya."
    },
];

export default function KebijakanPrivasiPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50/50 pt-28 pb-20 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto space-y-8">

                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">Kebijakan Privasi</h1>
                        <p className="text-lg text-muted-foreground flex justify-center max-w-xl mx-auto">
                            Memaparkan komitmen serius kami dalam menggaransi dan merawat entitas informasi pribadi Anda di platform Cetha.
                        </p>
                    </div>

                    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
                        <CardContent className="p-8 md:p-12">
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    Efektif terhitung sejak: <strong>1 Januari 2026</strong>. <br />
                                    Terima kasih telah bergabung di Cetha Kurawal! Bagi kami, Anda bukan sekedar metrik komputer melainkan talenta manusia sejati yang berhak mendapat layanan privasi solid. Bacalah dokumentasi berikut agar tiada distorsi perihal alur hidup data Anda:
                                </p>

                                <div className="space-y-10">
                                    {SECTIONS.map((section, idx) => (
                                        <div key={idx} className="space-y-3">
                                            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                                                <span className="flex items-center justify-center bg-blue-100 text-blue-700 w-8 h-8 rounded-full text-sm font-bold shrink-0">
                                                    {idx + 1}
                                                </span>
                                                {section.title}
                                            </h2>
                                            <p className="text-gray-600 leading-relaxed pl-11">
                                                {section.content}
                                            </p>
                                            {idx !== SECTIONS.length - 1 && (
                                                <Separator className="mt-6 ml-11 w-auto bg-gray-100" />
                                            )}
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
