"use client";

import axios from "axios";
import Image from "next/image";
import { useDataReviewStore } from "@/store/dataReviewStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUploadStore } from "@/store/uploadStore";
import { useTranslations } from "next-intl";

import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Trash2, ChevronRight } from "lucide-react";

import logo from "@/assets/icons/upload-docs.svg";
import office from "@/assets/icons/office-docsx.svg";

import { auth, db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { sanitizeForFirestore } from "@/lib/utils";

/**
 * UploadCvDashboard — versi upload CV khusus dashboard.
 * Setelah upload berhasil, TIDAK melakukan redirect.
 * Hasil review langsung ditampilkan inline di halaman dashboard.
 */
const UploadCvDashboard = () => {
  const t = useTranslations("uploadCvDashboard");

  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploading = useUploadStore((s) => s.uploading);
  const setGlobalUploading = useUploadStore((s) => s.setUploading);
  const setProgressGlobal = useUploadStore((s) => s.setProgress);
  const [uploadEnabled, setUploadEnabled] = useState(true);

  const setReviewData = useDataReviewStore((state) => state.setReviewData);

  // Helper: Buat preview jika file PDF
  const generatePreview = (file: File) => {
    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  // Saat pilih file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning(t("toast.onlyPdf"));
      return;
    }

    setSelectedFile(file);
    generatePreview(file);
  };

  // Saat drag & drop file
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!uploadEnabled) return;

    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.warning(t("toast.onlyPdf"));
      return;
    }

    setSelectedFile(file);
    generatePreview(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Upload file ke backend
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t("toast.selectFileFirst"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    try {
      setGlobalUploading(true, "cv");
      setProgressGlobal(5);

      const res = await axios.post("/api/upload", formData, {
        onUploadProgress: (event) => {
          const percent = event.total
            ? Math.round((event.loaded * 100) / event.total)
            : 0;
          const mapped = Math.min(70, Math.max(8, Math.round(percent * 0.7)));
          setProgressGlobal(mapped);
        },
      });

      setProgressGlobal(82);

      toast.success(t("toast.uploadSuccess"));
      const apiResult = res.data?.data?.result;
      const reviewResult = Array.isArray(apiResult)
        ? apiResult
        : apiResult?.data;

      if (!Array.isArray(reviewResult) || reviewResult.length === 0) {
        throw new Error(t("errors.emptyAnalysis"));
      }

      setReviewData({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileUrl: "",
        result: reviewResult,
      });
      setProgressGlobal(90);

      if (auth.currentUser) {
        try {
          const firestoreResult = sanitizeForFirestore(reviewResult);
          await addDoc(collection(db, "cvReviews"), {
            userId: auth.currentUser.uid,
            fileName: selectedFile.name,
            createdAt: new Date().toISOString(),
            result: firestoreResult,
          });
          setProgressGlobal(96);
        } catch (_) { }
      }

      setProgressGlobal(100);
      await new Promise((resolve) => setTimeout(resolve, 320));
      router.push("/dashboard/review-cv/result-review-cv");
      setGlobalUploading(false);
    } catch (err: any) {
      console.error("❌ Upload error", err);

      // Normalisasi error axios vs non-axios
      const status = err?.response?.status ?? null;
      const data = err?.response?.data ?? null;
      const backendMessage = data?.message as string | undefined;
      const fallbackMessage = err?.message as string | undefined;

      // Reset state
      setProgressGlobal(0);
      setGlobalUploading(false);

      if (status === 413) {
        toast.error(t("errors.fileTooLarge"));
        return;
      }

      if (status === 403) {
        const msg = backendMessage || t("errors.quotaInsufficient");
        toast.error(msg);

        return;
      }

      // Fallback generic error
      toast.error(
        t("errors.uploadFailed", {
          message: backendMessage || fallbackMessage || t("errors.unknown"),
        }),
      );
    }
  };

  return (
    <div className="mx-auto mt-4 w-full">
      <div
        className={`relative flex h-96 items-center justify-center rounded-2xl border-3 border-dashed ${uploadEnabled ? "cursor-pointer border-gray-400" : "cursor-not-allowed border-gray-300 bg-gray-100 opacity-60"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => {
          if (uploadEnabled) document.getElementById("insertFile")?.click();
        }}
      >
        {!selectedFile ? (
          <div className="flex flex-col justify-center gap-2 text-center">
            <Image
              src={logo}
              alt={t("uploadLogoAlt")}
              className="mx-auto h-15 w-15"
            />
            <h2 className="text-TextPrimary font-medium">
              {uploadEnabled ? (
                <>
                  {t("dropzone.ctaPrefix")} <br /> {t("dropzone.or")}{" "}
                  <label
                    htmlFor="insertFile"
                    className="text-primaryBlue cursor-pointer underline-offset-2 hover:underline"
                  >
                    {t("dropzone.uploadLabel")}
                  </label>
                </>
              ) : (
                <span className="text-gray-500">{t("dropzone.disabled")}</span>
              )}
            </h2>
            <input
              id="insertFile"
              type="file"
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={!uploadEnabled}
            />
          </div>
        ) : (
          <div className="relative flex h-full w-full items-center justify-center">
            {selectedFile.type === "application/pdf" && previewUrl ? (
              <div className="h-full w-full overflow-hidden rounded-2xl">
                <embed
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                  className="h-full w-full rounded p-2"
                />
                {selectedFile && (
                  <div className="absolute top-3 right-6 mb-2 flex items-center justify-between">
                    {selectedFile && (
                      <div
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <Badge
                          variant="destructive"
                          className="size-8 rounded-full"
                        >
                          <Trash2 />
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-700">
                <Image
                  src={office}
                  alt={t("officeIconAlt")}
                  className="mx-auto h-15 w-15"
                />
                <span className="font-medium">{selectedFile.name}</span>
                {selectedFile && (
                  <div className="absolute top-3 right-3 mb-2 flex items-center justify-between">
                    {selectedFile && (
                      <div
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                        }}
                      >
                        <Badge
                          variant="destructive"
                          className="size-8 rounded-full"
                        >
                          <Trash2 />
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-TextSecondary font-medium">{t("supportedFiles")}</p>
      </div>

      {/* Button Upload */}
      <div className="mx-auto w-full pt-10 md:pt-4">
        <div className="flex justify-start">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primaryBlue flex cursor-pointer items-center gap-1 rounded-full px-4 py-2.5 font-medium text-white disabled:opacity-50"
          >
            {t("submitButton")}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCvDashboard;
