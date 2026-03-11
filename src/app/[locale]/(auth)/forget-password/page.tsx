"use client";

import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { toast } from "sonner";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthCarousel from "@/components/auth-carousel";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslations("forgotPassword");

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isDisabled = loading;

  const handleResetPassword = async () => {
    if (!email) {
      toast.warning(t("toast.emptyEmail"));
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t("toast.success"));
    } catch (error: any) {
      console.error(error);

      switch (error.code) {
        case "auth/user-not-found":
          toast.warning(t("toast.userNotFound"));
          break;
        case "auth/invalid-email":
          toast.warning(t("toast.invalidEmail"));
          break;
        default:
          toast.error(t("toast.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="flex h-screen max-w-screen bg-[#F9FAFB]">
      <section className="max-w-8xl mx-auto flex min-h-screen w-full flex-row">
        {/* Left Panel */}
        <AuthCarousel />

        {/* Right Panel */}
        <div className="flex flex-1 p-3">
          <div className="relative flex flex-1 flex-col rounded-2xl bg-white shadow-sm">
            {/* Back Button */}
            <div
              className={`hidden transition-all delay-200 duration-500 ease-out md:block ${
                mounted
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-4 opacity-0"
              }`}
            >
              <button
                type="button"
                onClick={() => router.back()}
                className="group text-primaryBlue hover:bg-primaryBlue/10 absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                <span>{t("back")}</span>
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center px-4">
              <div className="flex w-full max-w-md flex-col gap-4">
                {/* Header */}
                <div
                  className={`flex flex-col gap-2 text-center transition-all delay-300 duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="text-TextPrimary text-3xl font-semibold">
                    {t("title")}
                  </div>
                  <div className="text-TextSecondary text-sm">
                    {t("subtitle")}
                  </div>
                </div>

                {/* Email Input */}
                <div
                  className={`mt-1 flex w-full flex-col gap-1 transition-all delay-[400ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="text-TextPrimary text-sm font-medium">
                    {t("emailLabel")}
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-10 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm transition-all duration-200 ease-out placeholder:text-gray-400 focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Reset Button */}
                <div
                  className={`mt-2 w-full transition-all delay-500 duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <button
                    onClick={handleResetPassword}
                    disabled={isDisabled}
                    className="bg-primaryBlue hover:bg-primaryBlueHover focus:ring-primaryBlue/30 h-10 w-full rounded-full font-semibold text-white transition-all duration-200 ease-out focus:ring-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDisabled ? t("sendLoading") : t("sendButton")}
                  </button>
                </div>

                {/* Back to Login Link */}
                <div
                  className={`text-TextSecondary mt-3 text-center font-medium transition-all delay-[600ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <p className="hidden lg:inline">{t("rememberPassword")} </p>
                  <Link
                    href="/login"
                    className="text-primaryBlue after:bg-primaryBlueHover hover:text-primaryBlueHover relative inline-block transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {t("backToLogin")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
