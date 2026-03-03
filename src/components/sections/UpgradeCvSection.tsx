import React, { useState } from "react";
import UploadCard from "@/components/ui/upload-card";
import { ArrowDownRight } from "lucide-react";

const UpgradeCvSection = () => {
  const [openImprovements, setOpenImprovements] = useState<number[]>([]);

  const toggleImprovement = (index: number) => {
    setOpenImprovements((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const penilaian_per_kategori = {
    dampak_pengalaman_kerja: 84,
  };

  const skor_keseluruhan = 82;

  const improvements = [
    {
      point: "Tambahkan hasil yang terukur pada pengalaman kerja",
      explanation:
        "Beberapa pengalaman kerja Anda masih bersifat deskriptif. Tambahkan metrik konkret seperti peningkatan penjualan, efisiensi proses, atau pertumbuhan pengguna untuk menunjukkan dampak nyata dan memperkuat daya saing CV Anda di mata recruiter.",
    },
    {
      point: "Perjelas ringkasan profesional di bagian atas CV",
      explanation:
        "Ringkasan profesional Anda masih terlalu umum. Gunakan 2–3 kalimat yang secara spesifik menyoroti spesialisasi utama, pengalaman inti, dan nilai unik yang Anda tawarkan agar recruiter langsung memahami positioning Anda dalam beberapa detik pertama.",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-8 md:py-12">
      <div className="flex flex-col items-center text-center">
        <div className="border-primaryBlue/40 bg-primaryBlue/5 rounded-full border px-3 py-1">
          <p className="text-primaryBlue text-sm font-medium tracking-wide">
            Tingkatkan CV
          </p>
        </div>
        <div className="mt-4 max-w-2xl">
          <h2 className="text-TextPrimary text-2xl font-semibold md:text-3xl">
            Tingkatkan Profil Profesional Anda dengan AI
          </h2>
          <p className="text-TextSecondary mt-2 text-base md:text-lg">
            Optimalkan resume Anda dengan AI untuk menonjolkan kekuatan dan
            pengalaman terbaik Anda di pasar kerja yang kompetitif.
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 1. Upload Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="flex justify-center">
            <UploadCard />
          </div>

          <div className="my-6 h-px w-full bg-gray-100" />

          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              1. Unggah CV Anda
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
              Unggah CV Anda dan dapatkan analisis serta rekomendasi perbaikan
              berbasis AI dalam hitungan detik.
            </p>
          </div>
        </div>

        {/* 2. Skor dan Kekuatan CV */}
        <div className="min-h-[260px] rounded-2xl bg-white p-8 shadow-sm md:col-span-2">
          {/* Header */}
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              2. Lihat Skor dan Kekuatan CV Anda
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              AI menganalisis kualitas CV Anda berdasarkan dampak pengalaman,
              struktur penulisan, dan daya tarik terhadap recruiter untuk
              menunjukkan area yang sudah kuat dan yang masih bisa ditingkatkan.
            </p>
          </div>

          <div className="my-4 h-px w-full bg-gray-100" />

          {/* Content */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center">
            {/* Progress Section */}
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  Dampak Pengalaman Kerja
                </p>

                <span className="text-primaryBlue text-sm font-semibold">
                  {penilaian_per_kategori.dampak_pengalaman_kerja}%
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-blue-50">
                <div
                  className="bg-primaryBlue h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${penilaian_per_kategori.dampak_pengalaman_kerja}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Pengalaman kerja Anda sudah menunjukkan dampak yang jelas dan
                relevan terhadap posisi yang dituju.
              </p>
            </div>

            {/* Score Section */}
            <div className="flex justify-center md:flex-none md:justify-center">
              <div className="flex flex-col items-center text-center">
                <p className="mb-2 text-xs font-medium text-gray-600">
                  Skor Keseluruhan
                </p>

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 shadow-inner">
                  <span className="text-primaryBlue text-xl font-bold">
                    {skor_keseluruhan}
                  </span>
                </div>

                <p className="mt-2 text-[11px] text-gray-500">
                  Di atas rata-rata kandidat
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Saran dan Perbaikan */}
        <div className="min-h-[260px] rounded-2xl bg-white p-8 shadow-sm md:col-span-2">
          {/* Header */}
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-gray-900">
              3. Dapatkan Saran & Perbaikan CV
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-500">
              AI menganalisis CV Anda dan memberikan rekomendasi spesifik untuk
              meningkatkan kekuatan konten, relevansi terhadap posisi, serta
              peluang lolos tahap screening.
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-gray-100" />

          {/* Content */}
          <div className="flex justify-center">
            <div className="w-full">
              <ul className="space-y-2">
                {improvements.map((item, idx) => (
                  <li key={idx}>
                    <div className="rounded-xl border border-gray-100 bg-gray-50/40 transition-all duration-300 hover:border-amber-200 hover:bg-amber-50/40">
                      <button
                        type="button"
                        onClick={() => toggleImprovement(idx)}
                        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 transition-colors hover:text-amber-600 focus:outline-none"
                      >
                        <span>{item.point}</span>

                        <span
                          className={`transition-transform duration-300 ${
                            openImprovements.includes(idx)
                              ? "rotate-180 text-amber-500"
                              : ""
                          }`}
                        >
                          <ArrowDownRight className="h-4 w-4 text-gray-400" />
                        </span>
                      </button>

                      {openImprovements.includes(idx) && (
                        <div className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Cta */}
        <div className="bg-primaryBlue flex min-h-[260px] flex-col justify-between rounded-2xl p-8 text-white shadow-lg">
          <div>
            <h3 className="text-xl leading-snug font-semibold">
              Siap Tingkatkan CV Anda?
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-white/80">
              Dapatkan analisis mendalam dan rekomendasi berbasis AI untuk
              meningkatkan struktur, wording, dan daya tarik CV Anda di mata
              recruiter.
            </p>
          </div>

          <div className="mt-6">
            <button className="text-primaryBlue w-full rounded-xl bg-white py-3 text-sm font-semibold transition hover:bg-gray-100">
              Coba Review CV Sekarang
            </button>

            <p className="mt-3 text-center text-xs text-white/70">
              Proses cepat • Insight profesional • Siap kirim ke recruiter
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpgradeCvSection;
