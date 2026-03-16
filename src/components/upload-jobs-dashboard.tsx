"use client";

import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight } from "lucide-react";

import logo from "@/assets/icons/upload-docs.svg";
import office from "@/assets/icons/office-docsx.svg";
import { auth } from "@/app/lib/firebase";
import { useJobResultStore } from "@/store/jobResultStore";
import { useUploadStore } from "@/store/uploadStore";
import { UpgradeModal } from "@/components/UpgradeModal";

/**
 * UploadJobsDashboard — versi upload jobs khusus dashboard.
 * Setelah upload berhasil, redirect ke /dashboard/job-match-result.
 * Tidak ada batasan upload guest (user dashboard pasti sudah login).
 */
const UploadJobsDashboard = () => {
  const t = useTranslations("uploadJobsDashboard");
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploading = useUploadStore((s) => s.uploading);
  const setGlobalUploading = useUploadStore((s) => s.setUploading);
  const setProgressGlobal = useUploadStore((s) => s.setProgress);
  const [uploadEnabled, setUploadEnabled] = useState(true);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const setJobResult = useJobResultStore((state) => state.setJobResult);

  const generatePreview = (file: File) => {
    if (file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    generatePreview(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!uploadEnabled) return;
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    generatePreview(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error(t("toast.selectFileFirst"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    let progressTicker: ReturnType<typeof setInterval> | null = null;

    try {
      setGlobalUploading(true, "job");
      setProgressGlobal(8);

      // Simulate steady progress while backend processing runs.
      progressTicker = setInterval(() => {
        const current = useUploadStore.getState().progress;
        if (current >= 75) return;
        const next = Math.min(
          75,
          current + Math.max(1, Math.round((75 - current) * 0.12)),
        );
        setProgressGlobal(next);
      }, 350);

      // Kirim ke backend untuk review
      const res = await fetch("/api/jobrecommend", {
        method: "POST",
        body: formData,
      });

      setProgressGlobal(82);

      if (!res.ok) {
        let errorMessage = t("errors.uploadFailed");
        let errData: any = {};
        try {
          errData = await res.json();
          errorMessage = errData?.message || errData?.error || errorMessage;
        } catch (_) {}

        if (res.status === 403 || errData?.requireUpgrade) {
          setUpgradeMessage(errorMessage);
          setShowUpgradeModal(true);
          setProgressGlobal(0);
          if (progressTicker) clearInterval(progressTicker);
          progressTicker = null;
          setGlobalUploading(false);
          return;
        }

        throw new Error(errorMessage);
      }

      const responseData = await res.json();

      const apiResult = responseData?.data?.result || responseData?.result;
      const parsedData = apiResult?.data?.[0];

      if (!parsedData) {
        throw new Error(t("errors.emptyResult"));
      }

      // Update global Zustand store
      setJobResult(parsedData);
      setProgressGlobal(93);
      toast.success(t("toast.recommendationCreated"));

      // Redirect ke halaman hasil setelah progress selesai.
      setProgressGlobal(100);
      await new Promise((resolve) => setTimeout(resolve, 320));
      router.push("/dashboard/job-match/job-match-result");
      setGlobalUploading(false);
    } catch (err: any) {
      console.error("❌ Upload gagal:", err.message || err);
      toast.error(err.message || t("errors.uploadFailed"));
      setProgressGlobal(0);
      setGlobalUploading(false);
    } finally {
      if (progressTicker) clearInterval(progressTicker);
    }
  };

  return (
    <div className="mt-4 w-full">
      {/* Upload Area */}
      <div
        className={`relative flex h-96 items-center justify-center rounded-2xl border-3 border-dashed ${
          uploadEnabled
            ? "cursor-pointer border-gray-400"
            : "cursor-not-allowed border-gray-300 bg-gray-100 opacity-60"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => {
          if (uploadEnabled) document.getElementById("insertJobFile")?.click();
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
                    htmlFor="insertJobFile"
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
              id="insertJobFile"
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
                <div className="absolute top-3 right-6 mb-2 flex items-center justify-between">
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
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-700">
                <Image
                  src={office}
                  alt={t("officeIconAlt")}
                  className="mx-auto h-15 w-15"
                />
                <span className="font-medium">{selectedFile.name}</span>
                <div className="absolute top-3 right-3 mb-2 flex items-center justify-between">
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
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-TextSecondary font-medium">{t("supportedFiles")}</p>
      </div>

      {/* Tombol Analisis */}
      <div className="mx-auto w-full pt-4">
        <div className="flex justify-end lg:justify-start">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="bg-primaryBlue flex cursor-pointer items-center gap-1 rounded-full px-4 py-2.5 font-medium text-white disabled:opacity-50"
          >
            {t("analyzeButton")}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        message={upgradeMessage}
      />
    </div>
  );
};

export default UploadJobsDashboard;
