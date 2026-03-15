"use client";

import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import Image from "next/image";
import { AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import clsx from "clsx";

export default function UserAvatar({ className = "" }) {
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [initials, setInitials] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.photoURL && typeof user.photoURL === "string") {
          setPhotoURL(user.photoURL);
        } else {
          const name = user.displayName || user.email || "";
          const parts = name.trim().split(" ");
          const first = parts[0]?.[0] || "";
          const last = parts[1]?.[0] || "";
          setInitials((first + last).toUpperCase());
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Skeleton className={clsx("h-8 w-8 rounded-full", className)} />;
  }

  return (
    <div
      className={clsx(
        "flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gray-200",
        className,
      )}
    >
      {photoURL ? (
        <Image
          src={photoURL}
          alt="Avatar"
          width={1024}
          height={1024}
          className="rounded-full object-cover"
          referrerPolicy="no-referrer"
          unoptimized
        />
      ) : initials ? (
        <span className="text-sm font-semibold text-gray-700">{initials}</span>
      ) : (
        <AvatarImage
          src="https://github.com/shadcn.png"
          alt="avatar"
          className="rounded-full"
        />
      )}
    </div>
  );
}
