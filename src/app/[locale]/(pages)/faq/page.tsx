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
  description:
    "Temukan jawaban cepat atas kendala CV, Akun, dan Karir di platform Cetha Kurawal.",
};

const FAQ_ITEMS = [
  {
    question: "Apa itu platform Cetha Kurawal?",
    answer:
      "Cetha Kurawal adalah portal Karir masa depan yang digerakkan oleh kecerdasan buatan (Gen-AI). Di sini kamu bisa mendapatkan validasi Curriculum Vitae secara instan, tips optimasi LinkedIn, serta pustaka edukasi gratis seputar taktik lamaran kerja.",
  },
  {
    question: "Apakah sepenuhnya gratis alias tanpa bayar?",
    answer:
      "Betul! Sebagian besar fitur esensial seperti Review CV Standar dan Modul Tips Karir disediakan bebas biaya. Kami mensubsidi ongkos AI harian demi mendukung karir talenta digital Indonesia.",
  },
  {
    question: "Bagaimana cara melakukan review CV?",
    answer:
      "Sangat mudah. Kamu cukup mendaftar/login di platform kami, arahkan ke menu 'CV Review' dari Dashboard, lalu unggah dokumen PDF/Word kamu. Dalam hitungan detik, CethaBot akan mengeluarkan skor kualitas serta saran konstruktif untuk setiap bait kalimat CV-mu.",
  },
  {
    question: "Apakah jaminan aman untuk data pribadi saya?",
    answer:
      "Privasimu dienkripsi 100%. Kami tidak menyimpan salinan fisik dokumenmu di database tanpa izin. AI hanya sekadar membaca ekstrak teksmu dalam hitungan mikrodetik, lalu langsung dibumi-hanguskan dari memori pemrosesan AI.",
  },
  {
    question: "Output review-nya berwujud apa?",
    answer:
      "Bentuk evaluasinya mencakup skor numerik (0-100), poin kebaikan (Good Things) yang sudah tersemat di CV-mu, dan kritik poin krusial (Need Improvements) beserta koreksi redaksional kalimat mana yang lemah di mata HRD.",
  },
  {
    question: "Apakah layanan Cetha bisa menampung segala jurusan kuliah?",
    answer:
      "Tentu! Walaupun arsitekturnya difokuskan untuk tech/business talent, pondasi Prompt buatan Cetha tetap relevan menaksir CV dari bidang sosial, medikal, keilmuan bahasa, ataupun sastra seni sekalipun.",
  },
  {
    question: "Di mana saya bisa mulai membaca Tips Karir?",
    answer:
      "Setelah login, kamu bisa menuju ke sisi kiri layar (Sidebar navigasi), lalu mengklik 'Artikel & Video'. Di sana tersaji ragam konten eksklusif yang ditulis oleh tim kurasi kami.",
  },
  {
    question: "Bagaimana tata cara menghubungi tim Support sesungguhnya?",
    answer:
      "Kamu bisa bertamu kapan pun ke menu 'Hubungi Kami' yang tersemat pada tautan footer di bagian paling bawah halaman, atau sekadar melempar direct mail ke alamat support@cetha.id.",
  },
];

export default function FAQPage() {
  return (
    <section className="min-h-screen bg-gray-50/50 px-4 pt-32 pb-20 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="mb-4 space-y-4 text-center">
          <div className="mb-2 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold tracking-wider text-blue-800 uppercase">
            Bantuan Terpadu
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Kompilasi FAQ
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
            Mulai dari teknis Artificial Intelligence hingga jaminan keamanan
            privasi. Temukan jalan pintas atas kegelisahan operasionalmu di
            sini.
          </p>
        </div>

        <Card className="overflow-hidden rounded-2xl border-gray-200 bg-white shadow-sm">
          <CardContent className="p-6 md:p-10">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-xl border bg-white px-5 py-1 shadow-sm transition-colors hover:bg-gray-50/50 data-[state=open]:border-blue-200 data-[state=open]:bg-blue-50/30"
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold text-gray-800 hover:no-underline sm:text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 leading-relaxed text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
