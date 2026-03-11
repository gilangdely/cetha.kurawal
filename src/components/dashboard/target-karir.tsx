import { Target, PlusCircle, Pencil, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db, auth } from "@/app/lib/firebase";
import EditTargetKarir from "./edit-target-karir";
import { TargetKarirSkeleton } from "../target-karir-skeleton";
import { toast } from "sonner";

interface Task {
  id: number;
  label: string;
  checked: boolean;
}

interface StoredTarget {
  id: string;
  label: string;
  progress: number;
  tasks?: Task[];
  completed?: number;
}

export default function TargetKarir() {
  const [targets, setTargets] = useState<StoredTarget[]>([]);
  const [isAddingTarget, setIsAddingTarget] = useState(false);
  const [editTarget, setEditTarget] = useState<StoredTarget | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Ambil user ID (bisa null kalau belum login)
  const userId = auth.currentUser?.uid;

  // Load semua target karir dari Firestore (real-time listener)
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "careerTargets"), // ← top-level
      where("userId", "==", userId), // ← filter berdasarkan userId
      orderBy("updatedAt", "desc"), // atau orderBy("label") kalau mau
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: StoredTarget[] = [];
      snapshot.forEach((doc) => {
        loaded.push({
          id: doc.id, // ← PASTIKAN INI ADA
          ...(doc.data() as Omit<StoredTarget, "id">),
        });
      });
      setTargets(loaded);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const recomputeProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.checked).length;
    return Math.round((done / tasks.length) * 100);
  };

  // Simpan atau update target ke Firestore
  // Fungsi saveTargetToFirestore → tambahin userId di data
  const saveTargetToFirestore = async (
    data: { label: string; tasks: Task[] },
    existingId?: string,
  ) => {
    if (!userId) return;

    const progress = recomputeProgress(data.tasks);
    const targetData = {
      userId,
      label: data.label,
      progress,
      tasks: data.tasks,
      updatedAt: new Date(),
    };

    try {
      if (existingId && existingId.startsWith("temp-") === false) {
        // Edit existing document
        console.log("Mengupdate document existing:", existingId);
        await setDoc(doc(db, "careerTargets", existingId), targetData, {
          merge: true,
        });
      } else {
        // Tambah baru
        console.log("Membuat document baru");
        const newRef = doc(collection(db, "careerTargets"));
        await setDoc(newRef, targetData);
        // Optional: update local state dengan id asli
        setTargets((prev) =>
          prev.map((t) => (t.id === existingId ? { ...t, id: newRef.id } : t)),
        );
      }
    } catch (err: any) {
      console.error("Gagal simpan:", err);
      alert("Error: " + err.message);
    }
  };

  const handleSaveNewTarget = async (data: {
    label: string;
    tasks: Task[];
  }) => {
    const existingId = editTarget?.id; // ← ini sekarang benar ada kalau edit

    // Optimistic update UI
    if (existingId) {
      setTargets((prev) =>
        prev.map((t) =>
          t.id === existingId
            ? {
                ...t,
                label: data.label,
                tasks: data.tasks,
                progress: recomputeProgress(data.tasks),
              }
            : t,
        ),
      );
    } else {
      // Tambah baru (tanpa id)
      const newTarget = {
        id: "temp-" + Date.now(), // id sementara biar key di map aman
        label: data.label,
        tasks: data.tasks,
        progress: recomputeProgress(data.tasks),
      };
      setTargets((prev) => [...prev, newTarget]);
    }

    // Simpan ke Firestore
    await saveTargetToFirestore(data, existingId);

    setEditTarget(null);
    setIsAddingTarget(false);
  };

  const handleDeleteTarget = async (targetId: string) => {
    if (!userId) return;

    const confirmDelete = confirm("Yakin ingin menghapus target ini?");
    if (!confirmDelete) return;

    try {
      // Hapus dari Firestore
      await deleteDoc(doc(db, "careerTargets", targetId));

      // Hapus dari state lokal (optimistic update)
      setTargets((prev) => prev.filter((t) => t.id !== targetId));
    } catch (err: any) {
      console.error("Gagal menghapus target:", err);
      alert("Error hapus target: " + err.message);
    }
  };

  const openAdd = () => {
    setEditTarget(null);
    setIsAddingTarget(true);
  };

  const openEdit = (target: StoredTarget) => {
    setEditTarget(target); // ← sekarang target sudah punya id
    setIsAddingTarget(true);
  };

  // Progress Text
  const getProgressText = (tasks?: Task[]) => {
    const total = tasks?.length || 0;
    const done = tasks?.filter((t) => t.checked).length || 0;

    if (total === 0) return "Belum ada langkah";
    if (done === total) return "Semua target tercapai";

    return `${done}/${total} langkah selesai`;
  };

  // Live update progress ketika task di-checklist di modal edit
  const handleTasksLiveUpdate = async (updatedTasks: Task[]) => {
    if (!editTarget?.id) return;

    const newProgress = recomputeProgress(updatedTasks);

    // Update UI dulu
    setTargets((prev) =>
      prev.map((t) =>
        t.id === editTarget.id
          ? { ...t, tasks: updatedTasks, progress: newProgress }
          : t,
      ),
    );
    setEditTarget((prev) =>
      prev ? { ...prev, tasks: updatedTasks, progress: newProgress } : prev,
    );

    // Simpan ke Firestore (hanya tasks & progress)
    // Live update task (hanya progress & tasks)
    if (userId && editTarget?.id) {
      await setDoc(
        doc(db, "careerTargets", editTarget.id), // ← top-level
        {
          tasks: updatedTasks,
          progress: newProgress,
          updatedAt: new Date(),
        },
        { merge: true },
      );
    }
  };

  // Jika belum login atau masih loading
  if (!userId) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-md">
        Silakan login untuk menyimpan target karir
      </div>
    );
  }

  if (loading) {
    return <TargetKarirSkeleton />;
  }

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xl font-bold tracking-tight text-slate-900">
          Target Karir
        </h4>

        <button
          onClick={openAdd}
          title="Tambah Target"
          className="group flex items-center justify-center rounded-lg bg-slate-900 p-2 text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-slate-800 hover:shadow-md active:scale-95"
        >
          <Plus
            size={16}
            className="transition-transform duration-200 group-hover:rotate-90"
          />
        </button>

        <EditTargetKarir
          open={isAddingTarget}
          onOpenChange={setIsAddingTarget}
          showTrigger={false}
          onSave={handleSaveNewTarget}
          initialTitle={editTarget?.label}
          initialTasks={editTarget?.tasks || []}
          onTasksChange={handleTasksLiveUpdate}
        />
      </div>

      {/* Main Container */}
      <div className="flex flex-col gap-3">
        {targets.length > 0 ? (
          targets.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* icon */}
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm">
                    <Target size={16} />
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </h5>

                    {/* tambahan info */}
                    <p className="text-xs text-slate-400">
                      {getProgressText(item.tasks)}
                    </p>
                  </div>
                </div>

                <div className="group flex items-center gap-2">
                  <span className="order-2 flex items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600 transition-all duration-300 ease-in-out group-hover:order-1">
                    {item.progress}%
                  </span>

                  <button
                    onClick={() => openEdit(item)}
                    className="order-1 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700 xl:translate-x-1 xl:opacity-0"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteTargetId(item.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="order-1 flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-700 xl:translate-x-1 xl:opacity-0"
                    title="Hapus Target"
                  >
                    <PlusCircle className="rotate-45" size={14} />
                  </button>
                </div>
              </div>

              {/* progress */}
              <div className="relative mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white py-12 text-center">
            {/* Icon */}
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5">
              <Target size={24} className="text-indigo-500" />
            </div>

            {/* Badge motivasi */}
            <span className="mb-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
              Mulai dari langkah kecil
            </span>

            {/* Title */}
            <p className="text-base font-semibold text-slate-800">
              Belum ada target karir
            </p>

            {/* Motivational text */}
            <p className="mt-1 mb-5 max-w-xs text-xs leading-relaxed text-slate-400">
              Setiap langkah kecil sangat berarti. Mulailah susun tujuan besarmu
              dan wujudkan karier yang kamu impikan.
            </p>

            {/* CTA */}
            <button
              onClick={openAdd}
              className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-indigo-500 hover:shadow-md active:scale-95"
            >
              Tambah Target
              <Plus
                size={16}
                className="transition-transform duration-200 group-hover:rotate-90"
              />
            </button>
          </div>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Target Karir</DialogTitle>
            <DialogDescription>
              Apakah kamu yakin ingin menghapus target ini? Tindakan ini tidak
              bisa dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (deleteTargetId) {
                  try {
                    await deleteDoc(doc(db, "careerTargets", deleteTargetId));
                    toast.success("Target karier berhasil di hapus");
                    setTargets((prev) =>
                      prev.filter((t) => t.id !== deleteTargetId),
                    );
                  } catch (err: any) {
                    console.error("Gagal menghapus target:", err);
                    alert("Error hapus target: " + err.message);
                  } finally {
                    setIsDeleteDialogOpen(false);
                    setDeleteTargetId(null);
                  }
                }
              }}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
