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
import AddTargetKarir from "./add-target-karir";
import { TargetKarirSkeleton } from "../target-karir-skeleton";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
}

export default function TargetKarir() {
  const t = useTranslations("DashboardCareerTargets");

  const [targets, setTargets] = useState<StoredTarget[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StoredTarget | null>(null);

  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "careerTargets"),
      where("userId", "==", userId),
      orderBy("updatedAt", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loaded: StoredTarget[] = [];

      snapshot.forEach((docSnap) => {
        loaded.push({
          id: docSnap.id,
          ...(docSnap.data() as Omit<StoredTarget, "id">),
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
      if (existingId && !existingId.startsWith("temp-")) {
        await setDoc(doc(db, "careerTargets", existingId), targetData, {
          merge: true,
        });
      } else {
        const newRef = doc(collection(db, "careerTargets"));
        await setDoc(newRef, targetData);

        setTargets((prev) =>
          prev.map((t) => (t.id === existingId ? { ...t, id: newRef.id } : t)),
        );
      }
    } catch (err: any) {
      console.error("Gagal simpan:", err);
      alert("Error: " + err.message);
    }
  };

  const handleSaveTarget = async (data: { label: string; tasks: Task[] }) => {
    const existingId = editTarget?.id;

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
      const newTarget = {
        id: "temp-" + Date.now(),
        label: data.label,
        tasks: data.tasks,
        progress: recomputeProgress(data.tasks),
      };

      setTargets((prev) => [...prev, newTarget]);
    }

    await saveTargetToFirestore(data, existingId);

    setEditTarget(null);
    setIsAddOpen(false);
    setIsEditOpen(false);
  };

  const openAdd = () => {
    setEditTarget(null);
    setIsAddOpen(true);
  };

  const openEdit = (target: StoredTarget) => {
    setEditTarget(target);
    setIsEditOpen(true);
  };

  const getProgressText = (tasks?: Task[]) => {
    const total = tasks?.length || 0;
    const done = tasks?.filter((t) => t.checked).length || 0;

    if (total === 0) return t("progress.noSteps");
    if (done === total) return t("progress.completed");

    return t("progress.steps", { done, total });
  };

  if (!userId) {
    return (
      <div className="rounded-xl bg-white p-6 text-center text-gray-500 shadow-md">
        {t("loginRequired")}
      </div>
    );
  }

  if (loading) {
    return <TargetKarirSkeleton />;
  }

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="text-xl font-bold tracking-tight text-slate-900">
          {t("header.title")}
        </h4>

        <button
          onClick={openAdd}
          className="group flex items-center justify-center rounded-lg bg-slate-900 p-2 text-white transition hover:bg-slate-800"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* ADD DIALOG */}
      <AddTargetKarir
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        showTrigger={false}
        onSave={handleSaveTarget}
      />

      {/* EDIT DIALOG */}
      <EditTargetKarir
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        showTrigger={false}
        onSave={handleSaveTarget}
        initialTitle={editTarget?.label}
        initialTasks={editTarget?.tasks || []}
      />

      {/* LIST */}
      <div className="flex flex-col gap-3">
        {targets.length > 0 ? (
          targets.map((item) => (
            <div
              key={item.id}
              className="group rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    <Target size={16} />
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-slate-800">
                      {item.label}
                    </h5>

                    <p className="text-xs text-slate-400">
                      {getProgressText(item.tasks)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-600">
                    {item.progress}%
                  </span>

                  <button
                    onClick={() => openEdit(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
                  >
                    <Pencil size={14} />
                  </button>

                  <button
                    onClick={() => {
                      setDeleteTargetId(item.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-100"
                  >
                    <PlusCircle className="rotate-45" size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <Target size={30} className="mx-auto text-indigo-500" />
            <p className="mt-3 font-semibold">{t("emptyState.title")}</p>

            <button
              onClick={openAdd}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white"
            >
              {t("emptyState.cta")}
            </button>
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description")}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {t("deleteDialog.cancel")}
            </Button>

            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteTargetId) return;

                await deleteDoc(doc(db, "careerTargets", deleteTargetId));

                setTargets((prev) =>
                  prev.filter((t) => t.id !== deleteTargetId),
                );

                toast.success("Target karier berhasil dihapus");

                setIsDeleteDialogOpen(false);
                setDeleteTargetId(null);
              }}
            >
              {t("deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
