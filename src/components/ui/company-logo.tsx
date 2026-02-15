"use client";

import Image from "next/image";

export function CompanyLogo({ domain }: { domain: string }) {
  const token = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLISHABLE_KEY;

  if (!token) {
    return <div className="h-7 w-7 rounded-md bg-gray-300 dark:bg-gray-600" />;
  }

  return (
    <Image
      src={`https://img.logo.dev/${domain}?token=${token}`}
      alt={`${domain} logo`}
      width={28}
      height={28}
      className="rounded-md"
    />
  );
}
