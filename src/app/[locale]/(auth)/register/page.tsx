"use client";

import { useState, useEffect } from "react";
import { registerUser, loginWithGoogle } from "@/app/lib/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import AuthCarousel from "@/components/auth-carousel";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function RegisterPage() {
  const router = useRouter();
  const t = useTranslations("register");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mounted, setMounted] = useState(false);

  const isDisabled = loading;

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      toast(t("toast.empty"));
      return;
    }

    if (password !== confirmPassword) {
      toast(t("toast.passwordMismatch"));
      return;
    }

    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    try {
      await registerUser(username, email, password, confirmPassword);
      toast(t("toast.success"));
      router.push("/login");
    } catch (error: any) {
      console.error("Error registrasi:", error);

      if (error.code === "auth/email-already-in-use") {
        toast(t("toast.emailUsed"));
        setErrorMsg(t("toast.emailUsed"));
      } else {
        toast(t("toast.failed"));
        setErrorMsg(t("toast.failedRetry"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const user = await loginWithGoogle();
      toast(`${t("toast.welcome")}, ${user.displayName}`);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error Google register:", error);
      toast(t("toast.googleFailed"));
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

                {/* Username Input */}
                <div
                  className={`flex flex-col gap-1 transition-all delay-[400ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="text-TextPrimary text-sm font-medium">
                    {t("usernameLabel")}
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder={t("usernamePlaceholder")}
                    className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-10 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm transition-all duration-200 ease-out placeholder:text-gray-400 focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Email Input */}
                <div
                  className={`flex flex-col gap-1 transition-all delay-500 duration-700 ease-out ${
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder={t("emailPlaceholder")}
                    className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-10 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm transition-all duration-200 ease-out placeholder:text-gray-400 focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Password Input */}
                <div
                  className={`flex flex-col gap-1 transition-all delay-[600ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="text-TextPrimary text-sm font-medium">
                    {t("passwordLabel")}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder={t("passwordPlaceholder")}
                    className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-10 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm transition-all duration-200 ease-out placeholder:text-gray-400 focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Confirm Password Input */}
                <div
                  className={`flex flex-col gap-1 transition-all delay-700 duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="text-TextPrimary text-sm font-medium">
                    {t("confirmPasswordLabel")}
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder={t("confirmPasswordPlaceholder")}
                    className="text-TextPrimary focus:border-primaryBlue focus:ring-primaryBlue/20 h-10 rounded-xl border-2 border-gray-300 bg-white px-3 text-sm transition-all duration-200 ease-out placeholder:text-gray-400 focus:ring-2 focus:outline-none"
                  />
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <p className="animate-in fade-in slide-in-from-top-2 text-sm text-red-500 duration-300">
                    {errorMsg}
                  </p>
                )}

                {/* Register Button */}
                <div
                  className={`mt-2 w-full transition-all delay-[800ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <button
                    onClick={handleRegister}
                    disabled={isDisabled}
                    className="bg-primaryBlue hover:bg-primaryBlueHover focus:ring-primaryBlue/30 h-10 w-full rounded-full font-semibold text-white transition-all duration-200 ease-out focus:ring-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDisabled ? t("registerLoading") : t("registerButton")}
                  </button>
                </div>

                {/* Divider */}
                <div
                  className={`flex items-center gap-6 transition-all delay-[900ms] duration-700 ease-out ${
                    mounted ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  }`}
                >
                  <div className="h-0.5 w-full rounded-lg bg-gray-200" />
                  <div className="text-TextSecondary text-sm">{t("or")}</div>
                  <div className="h-0.5 w-full rounded-lg bg-gray-200" />
                </div>

                {/* Google Register Button */}
                <div
                  className={`transition-all delay-1000 duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <button
                    onClick={handleGoogleRegister}
                    disabled={isDisabled}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-full border-2 border-[#E0E1E2] bg-[#F9FAFB] transition-all duration-200 ease-out hover:bg-white hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 48 48">
                      <path
                        fill="#fbc02d"
                        d="M43.6 20.5H42V20H24v8h11.3C33.3 32.3 29.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-3.5z"
                      />
                      <path
                        fill="#e53935"
                        d="M6.3 14.6l6.6 4.8C14.4 16.2 18.9 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.3 29.6 4 24 4c-7.3 0-13.6 3.9-17.1 9.6z"
                      />
                      <path
                        fill="#4caf50"
                        d="M24 44c5.1 0 9.9-1.9 13.5-5.1l-6.2-5.2C29.6 35.7 26.9 37 24 37c-5 0-9.2-3.3-10.7-7.9l-6.6 5.1C10.3 39.6 16.7 44 24 44z"
                      />
                      <path
                        fill="#1565c0"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.7-6.1 7.2l6.2 5.2c-0.4 0.3 6.6-4.8 6.6-13.9 0-1.3-.1-2.7-.4-3.5z"
                      />
                    </svg>
                    <p className="text-TextPrimary font-medium">
                      {isDisabled ? t("registerLoading") : t("googleRegister")}
                    </p>
                  </button>
                </div>

                {/* Login Link */}
                <div
                  className={`text-TextSecondary mt-3 text-center font-medium transition-all delay-[1100ms] duration-700 ease-out ${
                    mounted
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <p className="hidden lg:inline">{t("alreadyHaveAccount")} </p>
                  <Link
                    href="/login"
                    className="text-primaryBlue after:bg-primaryBlueHover hover:text-primaryBlueHover relative inline-block transition-colors duration-150 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100"
                  >
                    {t("login")}
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
