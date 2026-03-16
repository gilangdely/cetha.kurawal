import { hasLocale, NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cetha",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = require(`../../messages/${locale}.json`);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
