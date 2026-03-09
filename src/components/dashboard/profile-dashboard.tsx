"use client";

import { useRouter } from "next/navigation";
import { Avatar } from "@radix-ui/react-avatar";
import UserAvatar from "@/components/user-avatar";
import { Edit, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { ProfileDashboardSkeleton } from "../profile-dashboard-skeleton";

interface UserData {
  username?: string;
  email?: string;
  photoURL?: string;
  role?: string[];
  skills?: string[];
}

export default function ProfileDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        const normalized: UserData = {
          ...data,
          role: Array.isArray(data.role)
            ? data.role
            : data.role
              ? [data.role]
              : [],
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills
              ? [data.skills]
              : [],
        };

        setUserData(normalized);
      }

      setLoading(false);
    };

    loadUser();
  }, [user]);

  if (loading) {
    return <ProfileDashboardSkeleton />;
  }

  const roles = userData?.role || [];
  const skills = userData?.skills || [];

  return (
    <div className="relative flex w-full flex-col items-center overflow-hidden rounded-3xl bg-gradient-to-b from-white to-slate-50 p-5 shadow-sm">
      {/* Accent */}
      <div className="bg-primaryBlue/30 absolute -top-20 -right-20 h-40 w-40 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

      {/* Avatar */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-2 inline-block">
          <Avatar className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
            <UserAvatar className="h-full w-full object-cover text-slate-400" />
          </Avatar>

          <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
            <div className="h-1 w-1 rounded-full bg-white" />
          </div>
        </div>

        {/* User Info */}
        <h2 className="text-2xl font-semibold text-gray-900">
          {userData?.username || "Explorer"}
        </h2>

        <div className="mt-0.5 flex items-center gap-1 text-slate-500">
          <Mail size={14} className="text-slate-400" />
          <p className="text-sm font-medium">{userData?.email || "No email"}</p>
        </div>

        {/* Edit */}
        <Link
          href="/dashboard/my-profile"
          className="absolute top-4 right-4 flex items-center justify-center rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <Edit size={16} />
        </Link>
      </div>

      {/* ROLE */}
      <div className="z-10 mt-4 w-full border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">
            Status kamu saat ini
          </p>
          <span className="z-10 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {roles.length} role
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {roles.length > 0 ? (
            roles.map((r) => (
              <span
                key={r}
                className="text-primaryBlue border-primaryBlue/40 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
              >
                {r}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">Belum ada role</p>
          )}
        </div>
      </div>

      {/* SKILLS */}
      <div className="z-10 mt-4 w-full">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">Top Skills</p>
          <span className="z-10 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {skills.length} Role
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="text-primaryBlue border-primaryBlue/40 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-xs text-gray-400">Belum ada skill</p>
          )}
        </div>
      </div>
    </div>
  );
}
