"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CtaSection from "@/components/sections/CtaSection";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import {
  ChevronRight,
  Goal,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

import iyanImage from "@/assets/img/iyan.jpg";
import firmanImage from "@/assets/img/firman.jpg";
import gilangImage from "@/assets/img/gilang.jpg";
import illustration from "@/assets/img/illustration-about-us.jpg";

const profiles = [
  { id: 1, foto: iyanImage, nama: "Agus Priyanto", role: "Frontend Developer" },
  { id: 2, foto: gilangImage, nama: "Gilang Dely", role: "Backend Developer" },
  {
    id: 3,
    foto: firmanImage,
    nama: "Firman Zamzami",
    role: "Machine Learning Developer",
  },
];

const testimonials = [
  {
    quote:
      "Cetha benar-benar membantu saya menyusun CV yang lebih profesional. Hasilnya, saya lebih percaya diri melamar pekerjaan.",
    name: "Andi Pratama",
    title: "Fresh Graduate",
  },
  {
    quote:
      "Saya suka cara Cetha memberikan rekomendasi lowongan sesuai profil LinkedIn saya. Sangat relevan!",
    name: "Siti Rahma",
    title: "UI/UX Designer",
  },
  {
    quote:
      "Proses optimasi CV sangat mudah dipahami. Dalam hitungan menit, CV saya terlihat jauh lebih menarik.",
    name: "Bima Nugraha",
    title: "Software Engineer",
  },
  {
    quote:
      "Fitur analisis CV membantu saya menemukan kekurangan yang tidak pernah saya sadari sebelumnya.",
    name: "Dewi Lestari",
    title: "Marketing Specialist",
  },
  {
    quote:
      "Saya berhasil dipanggil interview di perusahaan impian setelah memperbaiki CV lewat Cetha.",
    name: "Rudi Hartono",
    title: "Data Analyst",
  },
  {
    quote:
      "Sangat terbantu! Cetha memberikan insight yang membuat profil saya lebih menarik di mata recruiter.",
    name: "Nadia Putri",
    title: "Product Manager",
  },
  {
    quote: "Pengalaman yang menyenangkan! Antarmuka simpel, hasilnya maksimal.",
    name: "Fajar Kurniawan",
    title: "Frontend Developer",
  },
  {
    quote:
      "Dengan bantuan Cetha, saya bisa lebih percaya diri dalam mencari pekerjaan. Sangat direkomendasikan.",
    name: "Aulia Syah",
    title: "HR Specialist",
  },
];

const stats = [
  { icon: Goal, name: "100+ Pengguna" },
  { icon: FileText, name: "CV Lebih keren" },
];

export default function AboutUsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-20 lg:pt-0">
      <div className="flex w-full flex-col items-center justify-center py-16 lg:pt-28">
        <div className="flex max-w-2xl flex-col items-center text-center">
          {/* Badge */}
          <div className="border-primaryBlue/30 bg-primaryBlue/5 text-primaryBlue rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide">
            Tim Profesional Kami
          </div>

          {/* Title */}
          <div className="mt-4 max-w-2xl">
            <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
              Bersama Membangun Solusi Inovatif untuk Masa Depan
            </h2>

            {/* Description */}
            <p className="text-TextSecondary mt-2 text-base md:text-lg">
              Kami bekerja dengan visi yang jelas dan komitmen tinggi untuk
              membantu Anda tumbuh dan unggul secara profesional.
            </p>
          </div>

          <div className="mt-6 flex flex-row gap-3">
            <a
              href="https://kurawal.space/"
              target="_blank"
              rel="noopener noreferrer"
              className="group border-primaryBlue text-primaryBlue hover:border-primaryBlueHover hover:bg-primaryBlue/5 hover:text-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center gap-2 rounded-full border-2 px-4 py-1.5 whitespace-nowrap transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:w-fit"
            >
              <Globe
                size={16}
                className="shrink-0 transition-transform duration-200 group-hover:rotate-6"
              />
              <span>Kunjungi Profile Kami</span>
            </a>

            <div className="group bg-primaryBlue hover:bg-primaryBlueHover focus-visible:ring-primaryBlue flex w-full items-center justify-center gap-2 rounded-full px-4 py-1.5 font-semibold whitespace-nowrap text-white shadow-sm transition-all duration-200 ease-out hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] md:w-fit">
              Hubungi Kami
            </div>
          </div>
        </div>
        <div className="mt-10 grid w-full max-w-3xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <div key={profile.id} className="relative">
              {/* Image */}
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={profile.foto}
                  alt={profile.nama}
                  className="h-80 w-full object-cover grayscale"
                />
              </div>

              {/* Card Overlay */}
              <div className="absolute bottom-[10px] left-1/2 w-[85%] -translate-x-1/2 rounded-lg bg-white p-2 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900">
                  {profile.nama}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">{profile.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mx-auto w-full px-4 py-16 sm:px-6 lg:py-20">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="border-primaryBlue rounded-full border-2 px-2 py-1 lg:px-3 lg:py-1.5">
            <p className="text-primaryBlue lg:font-medium">
              Apa kata pengguna Cetha
            </p>
          </div>
          <div className="mt-4 max-w-3xl flex-col text-center">
            <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
              Cara Cetha Bantu Kamu Dapat <br className="hidden md:block" />
              Kerjaan Impian
            </h2>
            <p className="text-TextSecondary mt-2 text-base lg:text-lg">
              Ikuti langkah sederhana ini untuk optimalkan CV, tingkatkan profil
              LinkedIn, dan temukan lowongan yang paling cocok untukmu.
            </p>
          </div>
        </motion.div>

        <div className="py-10">
          <InfiniteMovingCards
            items={testimonials}
            direction="right"
            speed="slow"
          />
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
          />
        </div>
      </div>

      {/* Get in touch */}
      <div className="py-8 md:py-12">
        <div className="flex w-full justify-center">
          <div className="flex max-w-2xl flex-col items-center text-center">
            {/* Badge */}
            <div className="border-primaryBlue/30 bg-primaryBlue/5 text-primaryBlue w-fit rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide">
              Tim Profesional Kami
            </div>

            {/* Title */}
            <div className="mt-4 max-w-2xl">
              <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
                Bersama Membangun Solusi Inovatif untuk Masa Depan
              </h2>

              {/* Description */}
              <p className="text-TextSecondary mt-2 text-base md:text-lg">
                Kami bekerja dengan visi yang jelas dan komitmen tinggi untuk
                membantu Anda tumbuh dan unggul secara profesional.
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 grid w-full max-w-5xl gap-12 px-6 md:grid-cols-2">
          {/* LEFT - FORM */}
          <div>
            <form className="space-y-4 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                    placeholder="Nama depan"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                    placeholder="Nama belakang"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                  placeholder="email@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  className="focus:border-primaryBlue focus:ring-primaryBlue mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:outline-none"
                  placeholder="Tulis pesan Anda..."
                />
              </div>

              <button
                type="submit"
                className="bg-primaryBlue hover:bg-primaryBlueHover w-full rounded-lg py-3 font-semibold text-white transition-all duration-200"
              >
                Kirim Pesan
              </button>
            </form>
          </div>

          {/* RIGHT - CONTACT INFO */}
          <div className="flex flex-col gap-8 p-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Hubungi Kami
              </h3>
              <p className="mt-1 text-gray-600">
                Tim kami siap membantu melalui kontak berikut:
              </p>

              <div className="mt-2 flex items-center gap-3 text-gray-700">
                <Phone size={18} />
                <span>+62 812 3456 7890</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Kirim Email
              </h3>
              <div className="mt-2 flex items-center gap-3 text-gray-700">
                <Mail size={18} />
                <span>info@domainkamu.com</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Alamat</h3>
              <div className="mt-2 flex items-start gap-3 text-gray-700">
                <MapPin size={18} />
                <span>
                  Universitas Amikom Purwokerto, Purwokerto, Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
