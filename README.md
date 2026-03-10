# CETHA - Carrer Enhancement Through AI

<a href="https://cetha.kurawal.space">
  <img width="3192" height="981" alt="Frame 46" src="https://github.com/user-attachments/assets/07b9e21d-15ad-477c-a9b6-2e35633e479f" />
</a>

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.x-black.svg)
![React](https://img.shields.io/badge/React-19.x-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)


**CETHA** adalah platform inovatif berbasis AI yang dirancang untuk menjembatani kesenjangan antara pencari kerja dan standar industri. Kami memberikan analisis instan dan rekomendasi praktis untuk membantu Anda mengoptimalkan aset profesional (CV dan LinkedIn) agar sukses menembus *screening* perekrut.

---

## ✨ Fitur Unggulan Kami

Platform kami dibangun di atas tiga pilar utama untuk kesuksesan karir Anda:

### 1. 🤖 Review CV Berbasis AI (AI CV Reviewer)
Lupakan kebingungan saat membuat CV! Cukup unggah CV Anda (format .pdf), dan AI kami akan menganalisisnya dalam hitungan detik. Anda akan mendapatkan:
* **Skor Kualitas CV:** Penilaian objektif tentang seberapa baik CV Anda.
* **Analisis Mendalam:** Poin-poin apa saja yang sudah bagus dan apa yang perlu diperbaiki.
* **Rekomendasi Praktis:** Saran yang dapat langsung Anda terapkan untuk membuat CV Anda *stand out*.

#### Alur Pemrosesan Data (Data Processing Flow)
1. **Upload File:** Pengguna mengunggah file CV berformat `.pdf` melalui komponen `UploadCv` di halaman Review CV. Limit upload adalah 5 kali untuk pengguna tanpa login, yang dilacak melalui IP address atau sesi Auth.
2. **Validasi File:** Komponen memvalidasi format file (harus PDF) dan menampilkan *preview* untuk pengguna.
3. **Pengiriman Data:** File dikirim ke *endpoint* API internal Next.js di `/api/upload` menggunakan *FormData*.
4. **Pengecekan Kuota:** API memverifikasi status login dan kuota unggahan pengguna melalui *QuotaService*.
5. **Pemrosesan AI:** Jika kuota tersedia, file diteruskan ke server AI (Gradio API via Hugging Face di `firmanaziz/CV3`) untuk dianalisis.
6. **Hasil & Konsumsi Kuota:** Setelah mendapatkan hasil berupa skor, analisis, dan rekomendasi, *QuotaService* mencatat penggunaan kuota, dan data JSON dikembalikan ke *frontend*.
7. **Penyimpanan State:** Hasil tes disimpan pada *global state management* (`useDataReviewStore`) dan diarahkan ke halaman Hasil Review.

### 2. 👔 Optimalisasi Profil LinkedIn (LinkedIn Optimizer)
Profil LinkedIn adalah etalase digital profesional Anda. Cetha membantu Anda memolesnya hingga maksimal. AI kami akan memberikan:
* **Ulasan Profil Komprehensif:** Menganalisis *headline*, ringkasan, pengalaman, dan foto profil Anda.
* **Saran Strategis:** Tips untuk meningkatkan visibilitas dan daya tarik profil Anda di hadapan *recruiter*.

#### Alur Pemrosesan Data (Data Processing Flow)
1. **Input Username:** Pengguna memasukkan *username* LinkedIn mereka pada halaman Optimalisasi Profil LinkedIn.
2. **Pengiriman Data:** *Username* dikirim ke *endpoint* API internal Next.js di `/api/linkedin`.
3. **Pengecekan Kuota:** API memverifikasi status login dan kuota pengguna melalui *QuotaService*.
4. **Pengambilan API Eksternal:** Sistem secara bertahap mengambil data profil (_Overview_, _Details_, _Full Experience_, dan _Education_)
5. **Konsumsi Kuota:** Jika pengambilan data sukses, *QuotaService* mencatat penggunaan kuota untuk aktivitas "LinkedIn Optimization".
6. **Pengembalian Hasil:** Data profil terintegrasi dikembalikan sebagai format JSON ke *frontend* untuk ditampilkan.

### 3. 🏢 Job Match
Dapatkan rekomendasi pekerjaan yang paling sesuai dengan keahlian dan pengalamanmu, langsung dari analisis CV kamu.
* **Temukan Pekerjaan** : temukan pekerjaan yang paling sesuai dengan keahlian dan pengalamanmu.

#### Alur Pemrosesan Data (Data Processing Flow)
1. **Upload File:** Pengguna mengunggah file CV berformat `.pdf` melalui halaman Job Match.
2. **Validasi File:** Sistem memvalidasi bahwa format file yang diunggah harus PDF.
3. **Pengiriman Data:** File dikirim ke *endpoint* API internal Next.js di `/api/jobrecommend` menggunakan *FormData*.
4. **Pengecekan Kuota:** API memverifikasi status login dan kuota unggahan pengguna melalui *QuotaService*.
5. **Pemrosesan AI:** Jika kuota tersedia, file diteruskan ke server AI (Gradio API via Hugging Face di `firmanaziz/jobrecommendation-json`) dan memanggil fungsi `analyze_career_path`.
6. **Hasil & Konsumsi Kuota:** Setelah hasil rekomendasi pekerjaan JSON diterima, *QuotaService* mencatat penggunaan kuota untuk "Job Recommendation", dan data JSON dikembalikan ke *frontend*.

### 4. 🎓 Pusat Pembelajaran (Learning Hub)
Kesiapan karir bukan hanya tentang dokumen. Kami menyediakan pustaka konten yang relevan untuk mendukung pengembangan diri Anda:
* **Artikel Pilihan:** Wawasan terbaru seputar tren karir, tips wawancara, dan *personal branding*.
* **Kelas Online:** Kursus singkat untuk mengasah keahlian praktis yang dibutuhkan industri.

---

## 🚀 Fitur
### 1. Review CV
<img width="1902" height="891" alt="image" src="https://github.com/user-attachments/assets/31573c92-d9e7-451c-a2b4-9d2d8d9b52b3" />

### 2.  Improve profil linkedIn
<img width="1899" height="893" alt="image" src="https://github.com/user-attachments/assets/1ed51728-6e7d-4eed-beca-c8718ac5e804" />

### 3. Job Match
<img width="1901" height="887" alt="image" src="https://github.com/user-attachments/assets/77f832e4-af46-4a6e-894f-a3ff5ba71aac" />

### 4. Dashboard Karir
<img width="1920" height="1200" alt="image" src="https://github.com/user-attachments/assets/4bacea02-3ffa-49ce-81b2-b208b15fb07d" />


---

## 📁 Struktur Project

```text
cetha.kurawal/
├── 📁 public/                        # Public web assets (images, icons)
├── 📁 scripts/                       # Utility scripts (misal untuk set up data/admin)
└── 📁 src/                           # Source code utama aplikasi (frontend & API)
    ├── 📁 app/                       # Next.js App Router (pages layout, views, API routes)
    ├── 📁 assets/                    # File media internal (image, fonts, vectors)
    ├── 📁 components/                # Reusable React components (UI library Radix/Shadcn)
    ├── 📁 features/                  # Komponen, service, dan tipe yang spesifik untuk fitur
    ├── 📁 hooks/                     # Custom React hooks (logic terpisah dari komponen)
    ├── 📁 i18n/                      # Konfigurasi setup lokalisasi/internasionalisasi
    ├── 📁 lib/                       # Utility functions & inisialisasi modul (Firebase config)
    ├── 📁 messages/                  # Dictionary JSON untuk terjemahan tiap bahasa (i18n)
    ├── 📁 store/                     # Global state management menggunakan store Zustand
    └── 📁 types/                     # Global TypeScript type declarations & interfaces
```

---

## 💻 Teknologi yang Digunakan

Project ini dibangun dengan teknologi modern untuk memberikan pengalaman pengguna yang cepat, responsif, dan cerdas:

* **Frontend:** [Next.js](https://nextjs.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Database:** [Firestore (Google Firebase)](https://firebase.google.com/docs/firestore)
* **Artificial Intelligence:** [Google Gemini](https://ai.google.dev/docs)
* **Cloud Storage:** [Cloudinary](https://cloudinary.com/documentation)
* **Emails:** [Resend](https://resend.com/docs) & [Nodemailer](https://nodemailer.com/)
* **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Components:** [Radix UI](https://www.radix-ui.com/docs) & [Shadcn](https://ui.shadcn.com/docs), [Lucide React](https://lucide.dev/)

---

## 🛠️ Cara Menjalankan Project secara Lokal (Local Setup)

Ikuti langkah-langkah di bawah ini untuk menjalankan Cetha di lokal Anda:

### Prasyarat

Pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/en/) (versi 18.x atau lebih baru)
* npm atau [Yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)
* (Opsional) Akun Google Firebase, Cloudinary, Resend, dan API Key Google Gemini.

### Instalasi

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/gilangdely/cetha.kurawal.git
   cd cetha.kurawal
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Buat file `.env.local` di root direktori project dan isi dengan variabel yang dibutuhkan:
   ```env
   # Firebase Config
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   
   # Google Gemini API
   GEMINI_API_KEY=

   # Cloudinary (Opsional)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
   NEXT_PUBLIC_CLOUDINARY_API_KEY=
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

   # Resend (Opsional)
   RESEND_API_KEY=
   ```

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

5. **Akses Aplikasi:**
   Buka browser Anda dan navigasikan ke [http://localhost:3000](http://localhost:3000).

---

## 👥 Tim Pengembang

Project ini disusun oleh tim **Kurawal** untuk memberikan solusi cerdas bagi pencari kerja:
- **Gilang Dely Mukti**
- **Muhammad Agus Priyanto**
- **Firman Aziz**

---

## 🤝 Berkontribusi (Contributing)

Kami sangat senang jika Anda ingin berkontribusi pada Cetha! Berikut adalah cara untuk ikut serta:

1. Fork repository ini.
2. Buat branch fitur Anda (`git checkout -b feature/FiturKerenAnda`).
3. Commit perubahan Anda dengan pesan yang jelas (`git commit -m 'feat: menambahkan fitur keren'`).
4. Push ke branch (`git push origin feature/FiturKerenAnda`).
5. Buat Pull Request.

### 📝 Standar Format Commit

Untuk menjaga kerapian riwayat komit, kami mengikuti konvensi penamaan commit berikut:

| Tipe | Deskripsi | Contoh |
| :--- | :--- | :--- |
| `feat:` | Penambahan fitur atau fungsionalitas baru | `feat: menambahkan analisis CV dengan AI` |
| `add:` | Penambahan file, komponen, atau library baru | `add: menginstal shadcn ui form` |
| `fix:` | Perbaikan bug atau error | `fix: mengatasi error pada pemuatan PDF` |
| `docs:` | Pembaruan dokumentasi (README, comments) | `docs: memperbarui cara instalasi` |
| `style:` | Perubahan formatting (spasi, struktur yang tidak mengubah fungsi) | `style: merapikan indentasi profile` |
| `refactor:`| Merapikan atau menyusun ulang kode tanpa menambah/mengubah fitur | `refactor: memisahkan logika ke custom hook` |
| `perf:` | Peningkatan performa kode atau query | `perf: mengoptimalkan pengambilan data Firebase` |
| `chore:` | Pekerjaan rutin (update package, config, maintenance) | `chore: update next.js version` |

---

> *Memberdayakan pencari kerja dengan insight berbasis AI. Tampil lebih Cetha dan raih karir impian Anda!*
