"use client";
import { useState, useEffect } from "react";
import { Pencil, Plus, Eye, X, Trash2, Award } from "lucide-react";
import EditPencapaian, { Achievement } from "./edit-pencapaian";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { db, auth } from "@/app/lib/firebase";
import { toast } from "sonner";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PencapaianSkeleton } from "../pencapaian-skeleton";
import { useTranslations } from "next-intl";

interface PencapaianTerbaruProps {
  className?: string;
}

export default function PencapaianTerbaru({
  className = "",
}: PencapaianTerbaruProps) {
  const t = useTranslations("DashboardAchievements");
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [openEditor, setOpenEditor] = useState(false);
  const [editItem, setEditItem] = useState<Achievement | null>(null);
  const [previewItem, setPreviewItem] = useState<Achievement | null>(null);
  const [loading, setLoading] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Achievement | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      toast.error(t("errors.loginRequired"));
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "pencapaian"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Achievement[];

        setAchievements(data);
        setLoading(false);
      },
      () => {
        toast.error(t("errors.loadFailed"));
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const openDeleteDialog = (item: Achievement) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete?.id) return;

    try {
      await deleteDoc(doc(db, "pencapaian", itemToDelete.id));
      toast.success(t("success.deleted"));
    } catch {
      toast.error(t("errors.deleteFailed"));
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const openAdd = () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error(t("errors.loginRequiredAction"));
      return;
    }

    setEditItem(null);
    setOpenEditor(true);
  };

  const openEdit = (item: Achievement) => {
    const user = auth.currentUser;

    if (!user || item.userId !== user.uid) {
      toast.error(t("errors.noPermission"));
      return;
    }

    setEditItem(item);
    setOpenEditor(true);
  };

  const openPreview = (item: Achievement) => {
    setPreviewItem(item);
  };

  return (
    <>
      <div
        className={`space-y-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            {t("header.title")}
          </h4>

          <button
            onClick={openAdd}
            title={t("header.add")}
            className="group flex items-center justify-center rounded-lg bg-slate-900 p-2 text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-slate-800 hover:shadow-md active:scale-95"
          >
            <Plus
              size={16}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
          </button>

          <EditPencapaian
            open={openEditor}
            onOpenChange={(open) => {
              setOpenEditor(open);
              if (!open) setEditItem(null);
            }}
            onSave={() =>
              toast.success(editItem ? "Diperbarui" : "Ditambahkan")
            }
            initialData={editItem || undefined}
            showTrigger={false}
          />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <PencapaianSkeleton />
          ) : achievements.length > 0 ? (
            achievements.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => openPreview(item)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-sm">
                      <Award size={16} />
                    </div>

                    <div className="min-w-0">
                      <h5 className="truncate text-sm font-semibold text-slate-800">
                        {item.title}
                      </h5>

                      <p className="truncate text-xs text-slate-400 capitalize">
                        {item.category.replace("_", " ")}
                        {item.date
                          ? ` • ${new Date(item.date).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}`
                          : ""}
                      </p>
                    </div>
                  </button>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openPreview(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-blue-500 hover:text-white xl:opacity-0 xl:group-hover:opacity-100"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      onClick={() => openEdit(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-orange-500 hover:text-white xl:opacity-0 xl:group-hover:opacity-100"
                    >
                      <Pencil size={14} />
                    </button>

                    <button
                      onClick={() => openDeleteDialog(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-red-500 hover:text-white xl:opacity-0 xl:group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white py-12 text-center">
              {/* Icon */}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-900/5">
                <Award size={24} className="text-orange-400" />
              </div>

              {/* Badge motivasi */}
              <span className="mb-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-500">
                {t("emptyState.badge")}
              </span>

              {/* Title */}
              <p className="text-base font-semibold text-slate-800">
                {t("emptyState.title")}
              </p>

              {/* Motivational text */}
              <p className="mt-1 mb-5 max-w-xs text-xs leading-relaxed text-slate-400">
                {t("emptyState.description")}
              </p>

              {/* CTA */}
              <button
                onClick={openAdd}
                className="group flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-[1px] hover:bg-orange-600 hover:shadow-md active:scale-95"
              >
                {t("emptyState.cta")}
                <Plus
                  size={16}
                  className="transition-transform duration-200 group-hover:rotate-90"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW */}
      <Sheet
        open={!!previewItem}
        onOpenChange={(open) => !open && setPreviewItem(null)}
      >
        {previewItem && (
          <SheetContent className="px-5">
            <SheetHeader>
              <SheetTitle>{previewItem.title}</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4 text-sm">
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span className="rounded bg-gray-100 px-2 py-0.5 capitalize">
                  {previewItem.category.replace("_", " ")}
                </span>

                {previewItem.date && (
                  <span className="rounded bg-gray-100 px-2 py-0.5">
                    {new Date(previewItem.date).toLocaleDateString("id-ID")}
                  </span>
                )}
              </div>

              {previewItem.description ? (
                <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                  {previewItem.description}
                </p>
              ) : (
                <p className="text-gray-400 italic">
                  {t("preview.noDescription")}
                </p>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setPreviewItem(null);
                    openEdit(previewItem);
                  }}
                  className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-100"
                >
                  <Pencil size={14} /> {t("preview.edit")}
                </button>

                <button
                  onClick={() => setPreviewItem(null)}
                  className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-100"
                >
                  <X size={14} /> {t("preview.close")}
                </button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* DELETE DIALOG */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.rich("deleteDialog.description", {
                strong: (chunks) => <strong>{chunks}</strong>,
                title: itemToDelete?.title ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
