import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import image404 from "@/assets/img/404.png";
import "./globals.css";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center px-4 text-center">
      <Image
        src={image404}
        alt="404 Not Found"
        width={400}
        height={300}
        className="mb-6"
      />

      <h2 className="text-TextPrimary mb-2 text-2xl font-bold">{t("title")}</h2>

      <p className="text-TextSecondary mb-6 max-w-md">{t("description")}</p>

      <Link
        href="/"
        className="text-primaryBlue rounded-full px-6 py-2 text-lg font-semibold underline underline-offset-3 transition hover:text-blue-500"
      >
        {t("back")}
      </Link>
    </section>
  );
}
