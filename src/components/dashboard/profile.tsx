"use client";

import React, { useEffect, useState } from "react";
import { auth, db } from "@/app/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import UserAvatar from "@/components/user-avatar";
import { Avatar } from "@radix-ui/react-avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PencapaianTerbaru from "@/components/dashboard/pencapaian";
import { Edit, Pencil, X } from "lucide-react";

interface UserData {
  username?: string;
  email?: string;
  photoURL?: string;
  createdAt?: any;
  lastLogin?: any;
  role?: string;
  pekerjaan?: string[];
  skills?: string[];
  dreamJob?: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [pekerjaanInput, setPekerjaanInput] = useState("");
  const user = auth.currentUser;

  // === LOAD DATA USER ===
  useEffect(() => {
    const load = async () => {
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
          dreamJob: data.dreamJob || "",
          pekerjaan: Array.isArray(data.pekerjaan)
            ? data.pekerjaan
            : data.pekerjaan
              ? [data.pekerjaan]
              : [],
          skills: Array.isArray(data.skills)
            ? data.skills
            : data.skills
              ? [data.skills]
              : [],
        };

        setUserData(normalized);
      } else {
        const seed: UserData = {
          username: user.displayName || user.email?.split("@")[0],
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          pekerjaan: ["mahasiswa"],
          skills: ["React", "TypeScript", "Node.js"],
          dreamJob: "",
        };
        await setDoc(ref, seed);
        setUserData(seed);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  // === SIMPAN KE FIRESTORE ===
  const handleSaveProfile = async () => {
    if (!user || !userData) return;

    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        username: userData.username || "",
        pekerjaan: userData.pekerjaan || [],
        skills: userData.skills || [],
        dreamJob: userData.dreamJob || "",
      });
      console.log("Profile berhasil disimpan ke Firestore!");
      setEditOpen(false);
    } catch (error) {
      console.error("Gagal menyimpan profile:", error);
      alert("Gagal menyimpan, cek console untuk detail.");
    }
  };

  // === UPDATE STATE ===
  const handleChangeField = (field: keyof UserData, value: any) => {
    setUserData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  // === TAMBAH ROLE / SKILL ===
  const addItem = (
    input: string,
    setInput: (v: string) => void,
    field: "pekerjaan" | "skills",
  ) => {
    const trimmed = input.trim();
    if (trimmed && userData) {
      const current = userData[field] || [];
      if (!current.includes(trimmed)) {
        handleChangeField(field, [...current, trimmed]);
      }
      setInput("");
    }
  };

  // === HAPUS ITEM ===
  const removeItem = (field: "pekerjaan" | "skills", index: number) => {
    if (!userData) return;
    const current = userData[field] || [];
    handleChangeField(
      field,
      current.filter((_, i) => i !== index),
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="border-primaryBlue h-10 w-10 animate-spin rounded-full border-t-2 border-b-2" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Kamu belum login.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full">
      <div className="relative grid overflow-hidden rounded-3xl border p-4 shadow-sm lg:p-6">
        <div className="bg-primaryBlue/30 absolute -top-5 -right-5 h-40 w-40 rounded-full blur-3xl" />
        <div className="absolute -bottom-5 -left-5 h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="flex w-full sm:flex-row">
          <div className="w-full">
            {/* Header */}
            <div className="flex items-start justify-between">
              {/* Kiri: Avatar + Info */}
              <div className="flex items-center gap-4">
                <div className="relative inline-block">
                  <Avatar className="flex h-22 w-22 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
                    <UserAvatar className="h-full w-full object-cover text-slate-400" />
                  </Avatar>

                  <div className="absolute right-1 bottom-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-sm">
                    <div className="h-1 w-1 rounded-full bg-white" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h2 className="text-xl font-bold text-gray-800">
                    {userData?.username || user.displayName || "Pengguna"}
                  </h2>
                  <p className="text-gray-600">
                    {userData?.email || user.email}
                  </p>
                </div>
              </div>

              {/* Kanan: Tombol Edit */}
              <Sheet open={editOpen} onOpenChange={setEditOpen}>
                <SheetTrigger asChild>
                  <button className="z-10 flex items-center rounded-full border-slate-200 bg-white p-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:opacity-90 active:scale-[0.98]">
                    <Pencil size={16} />
                  </button>
                </SheetTrigger>

                <SheetContent className="overflow-y-auto px-4">
                  <SheetHeader className="px-0">
                    <SheetTitle>Edit Profil</SheetTitle>
                    <SheetDescription>
                      Ubah informasi dasar akun kamu.
                    </SheetDescription>
                  </SheetHeader>

                  {userData && (
                    <div className="space-y-6">
                      {/* Username */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                          Username
                        </label>

                        <input
                          value={userData.username || ""}
                          onChange={(e) =>
                            handleChangeField("username", e.target.value)
                          }
                          className="focus:border-primaryBlue focus:ring-primaryBlue/20 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition outline-none focus:ring-2"
                          placeholder="Masukkan username"
                        />
                      </div>

                      {/* DREAM JOB */}
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                            Pekerjaan Impian
                          </p>
                          <p className="text-xs text-gray-400">
                            Pekerjaan yang ingin kamu capai di masa depan
                          </p>
                        </div>

                        <input
                          value={userData.dreamJob || ""}
                          onChange={(e) =>
                            handleChangeField("dreamJob", e.target.value)
                          }
                          className="focus:border-primaryBlue focus:ring-primaryBlue/20 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition outline-none focus:ring-2"
                          placeholder="Contoh: Frontend Engineer di perusahaan teknologi"
                        />
                      </div>

                      {/* ROLE */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                            Profesi / Pekerjaan
                          </p>
                          <p className="text-xs text-gray-400">
                            Tekan Enter atau koma untuk menambahkan pekerjaan
                          </p>
                        </div>

                        <input
                          value={pekerjaanInput}
                          onChange={(e) => setPekerjaanInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              addItem(pekerjaanInput, setPekerjaanInput, "pekerjaan");
                            }
                          }}
                          className="focus:border-primaryBlue focus:ring-primaryBlue/20 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition outline-none focus:ring-2"
                          placeholder="Mahasiswa, Frontend Developer"
                        />

                        <div className="flex flex-wrap gap-2">
                          {(userData.pekerjaan || []).map((r, i) => (
                            <span
                              key={i}
                              className="text-primaryBlue border-primaryBlue/40 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
                            >
                              {r}

                              <button
                                onClick={() => removeItem("pekerjaan", i)}
                                className="text-primaryBlue/70 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SKILLS */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                            Skill Highlights
                          </p>
                          <p className="text-xs text-gray-400">
                            Tambahkan skill utama yang kamu kuasai
                          </p>
                        </div>

                        <input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === ",") {
                              e.preventDefault();
                              addItem(skillInput, setSkillInput, "skills");
                            }
                          }}
                          className="focus:border-primaryBlue focus:ring-primaryBlue/20 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm transition outline-none focus:ring-2"
                          placeholder="React, Next.js, Tailwind CSS"
                        />

                        <div className="flex flex-wrap gap-2">
                          {(userData.skills || []).map((s, i) => (
                            <span
                              key={i}
                              className="text-primaryBlue border-primaryBlue/40 inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
                            >
                              {s}

                              <button
                                onClick={() => removeItem("skills", i)}
                                className="text-primaryBlue/70 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* BUTTON */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveProfile}
                          className="bg-primaryBlue hover:bg-primaryBlue/90 rounded-xl"
                        >
                          Simpan Perubahan
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => setEditOpen(false)}
                          className="rounded-xl"
                        >
                          Batal
                        </Button>
                      </div>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-100" />

        {/* Info Detail */}
        <div className="space-y-6">
          {/* Dream Occupation */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-900">
                  Cita-cita kamu
                </p>
              </div>
            </div>

            <p className="mb-3 text-xs text-gray-500">
              Ini adalah cita-cita kamu
            </p>

            <div className="flex flex-wrap gap-2">
              {userData?.dreamJob ? (
                <span className="text-primaryBlue border-primaryBlue/40 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105">
                  {userData.dreamJob}
                </span>
              ) : (
                <span className="text-gray-400 italic">
                  Belum ada cita-cita yang ditambahkan
                </span>
              )}
            </div>
          </div>

          {/* ROLE */}
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-900">
                  Status kamu saat ini
                </p>
              </div>

              <span className="z-10 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {userData?.pekerjaan?.length || 0} role
              </span>
            </div>

            <p className="mb-3 text-xs text-gray-500">
              Status utama yang kamu jalankan saat ini
            </p>

            <div className="flex flex-wrap gap-2">
              {(userData?.pekerjaan || []).length > 0 ? (
                userData!.pekerjaan!.map((r) => (
                  <span
                    key={r}
                    className="text-primaryBlue border-primaryBlue/40 rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold transition hover:scale-105"
                  >
                    {r}
                  </span>
                ))
              ) : (
                <div className="w-full rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">Belum ada role.</p>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-gray-900">
                  Skill Highlights
                </p>
              </div>

              <span className="z-10 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {userData?.skills?.length || 0} skills
              </span>
            </div>

            <p className="mb-3 text-xs text-gray-500">
              Keahlian utama yang kamu miliki
            </p>

            <div className="flex flex-wrap gap-2">
              {(userData?.skills || []).length > 0 ? (
                userData!.skills!.map((skill) => (
                  <span
                    key={skill}
                    className="text-primaryBlue border-primaryBlue/40 rounded-xl border bg-white px-3 py-1 text-xs font-semibold transition hover:scale-105"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <div className="w-full rounded-xl bg-gray-50 p-4 text-center">
                  <p className="text-xs text-gray-500">Belum ada skill.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
