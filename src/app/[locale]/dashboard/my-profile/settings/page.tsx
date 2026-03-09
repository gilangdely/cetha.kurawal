"use client";

import { useState } from "react";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { toast } from "sonner";
import { Mail, LogOut, Globe } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleResetPassword = async () => {
    if (!email) {
      toast("Email tidak boleh kosong");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast("Link reset password telah dikirim ke email kamu.");
      setEmail("");
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/user-not-found":
          toast("Email tidak ditemukan.");
          break;
        case "auth/invalid-email":
          toast("Format email tidak valid.");
          break;
        default:
          toast("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);

    try {
      await signOut(auth);
      toast("Berhasil logout");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast("Gagal logout");
    } finally {
      setLogoutLoading(false);
    }
  };

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname.replace(/^\/(id|en)/, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Language */}
      <div className="max-w-lg">
        <h2 className="text-primaryBlue text-xl font-semibold">Language</h2>

        <p className="text-TextSecondary mt-1 text-sm">
          Pilih bahasa yang ingin kamu gunakan.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => changeLanguage("id")}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              locale === "id"
                ? "border-primaryBlue bg-primaryBlue text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Globe size={16} />
            Indonesia
          </button>

          <button
            onClick={() => changeLanguage("en")}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              locale === "en"
                ? "border-primaryBlue bg-primaryBlue text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Globe size={16} />
            English
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="my-10 border-t border-gray-200" />

      {/* Change Password */}
      <div className="max-w-lg">
        <h2 className="text-primaryBlue text-xl font-semibold">
          Change Password
        </h2>

        <p className="text-TextSecondary mt-1 text-sm">
          Kami akan mengirimkan link reset password ke email akun kamu.
        </p>

        <div className="mt-6">
          <label className="text-TextPrimary mb-2 block text-sm font-medium">
            Email
          </label>

          <div className="relative">
            <Mail
              size={16}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email akun kamu"
              className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-11 w-full rounded-xl border border-gray-300 bg-white pr-3 pl-9 text-sm transition-all placeholder:text-gray-400 focus:ring-2 focus:outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={loading}
          className="bg-primaryBlue hover:bg-primaryBlueHover focus:ring-primaryBlue/30 mt-6 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all focus:ring-2 focus:outline-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset Password"}
        </button>
      </div>

      {/* Divider */}
      <div className="my-10 border-t border-gray-200" />

      {/* Logout */}
      <div className="max-w-lg">
        <h2 className="text-primaryBlue text-xl font-semibold">Logout</h2>

        <p className="text-TextSecondary mt-1 text-sm">
          Keluar dari akun kamu di perangkat ini.
        </p>

        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 active:scale-[0.97] disabled:opacity-60"
        >
          <LogOut size={16} />
          {logoutLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
