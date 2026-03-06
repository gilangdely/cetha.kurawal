// filepath: d:\Projectan\cetha\src\components\dashboard\profil-dashboard.tsx
"use client";
import { useRouter } from "next/navigation";
import { Avatar } from "@radix-ui/react-avatar";
import UserAvatar from "@/components/user-avatar";
import { Edit, Rocket, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { auth } from "@/app/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import Link from "next/link";

interface ProfilDashboardProps {
  username: string | null;
  email: string | null;
  skills: string[];
  role?: string[] | string;
  onEditProfile?: () => void;
  onViewCV?: () => void;
}

interface UserData {
  username?: string;
  email?: string;
  photoURL?: string;
  createdAt?: any;
  lastLogin?: any;
  role?: string[] | string;
  skills?: string[];
}

export default function ProfilDashboard({
  username,
  email,
  skills,
  role = "-",
  onEditProfile,
  onViewCV,
}: ProfilDashboardProps) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = auth.currentUser;

  const roles = Array.isArray(userData?.role)
    ? userData.role
    : userData?.role
      ? [userData.role]
      : [];

  // === PALETTE WARNA UNTUK CHIP ===
  const chipColors = [
    "bg-red-50 text-red-600 border-red-100",
    "bg-amber-50 text-amber-600 border-amber-100",
    "bg-green-50 text-green-600 border-green-100",
    "bg-blue-50 text-blue-600 border-blue-100",
    "bg-indigo-50 text-indigo-600 border-indigo-100",
    "bg-purple-50 text-purple-600 border-purple-100",
    "bg-pink-50 text-pink-600 border-pink-100",
    "bg-orange-50 text-orange-600 border-orange-100",
    "bg-teal-50 text-teal-600 border-teal-100",
    "bg-cyan-50 text-cyan-600 border-cyan-100",
  ];

  // Fungsi hash sederhana → warna sama setiap skill/role
  const getChipColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return chipColors[Math.abs(hash % chipColors.length)];
  };

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserData(snap.data() as UserData);
      } else {
        const seed: UserData = {
          username: user.displayName || user.email?.split("@")[0],
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          role: ["mahasiswa"],
          skills: ["React", "TypeScript", "Node.js"],
        };
        await setDoc(ref, seed);
        setUserData(seed);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const displaySkills =
    (userData?.skills || []).length > 0 ? userData!.skills! : skills;

  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 p-5 transition-all duration-300 hover:shadow-sm">
      {/* Gradient Accent */}
      <div className="bg-primaryBlue/30 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      <div className="flex flex-col items-center text-center">
        {/* Avatar Section */}
        <div className="relative mb-2 inline-block">
          <Avatar className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
            <UserAvatar className="h-full w-full object-cover text-slate-400" />
          </Avatar>
          <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          {username || "Explorer"}
        </h2>
        <div className="mt-0.5 flex items-center justify-center gap-1 text-slate-500">
          <Mail size={14} className="text-slate-400" />
          <p className="text-sm font-medium">{email || "No email provided"}</p>
        </div>

        {/* Edit Button */}
        <Link
          href="/dashboard/profile"
          className="absolute top-4 right-4 flex w-fit items-center justify-center gap-2 rounded-full border border-slate-200 bg-white p-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
        >
          <Edit size={16} className="text-slate-500" />
        </Link>
      </div>

      {/* Skills Section */}
      <div className="z-10 mt-4 w-full border-t border-slate-100 pt-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            Top Skills
          </h3>
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {displaySkills.length} Skills
          </span>
        </div>

        <div className="flex cursor-default flex-wrap gap-2">
          {displaySkills.length > 0 ? (
            displaySkills.map((skill) => (
              <span
                key={skill}
                className="text-primaryBlue border-primaryBlue/40 inline-block rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold"
              >
                {skill}
              </span>
            ))
          ) : (
            <div className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center">
              <p className="text-xs font-medium text-slate-500">
                No skills added yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
