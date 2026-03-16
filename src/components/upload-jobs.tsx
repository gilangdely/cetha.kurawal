"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Trash2, ChevronRight } from "lucide-react";

import logo from "@/assets/icons/upload-docs.svg";
import office from "@/assets/icons/office-docsx.svg";
import { auth } from "@/app/lib/firebase";
import { useJobResultStore } from "@/store/jobResultStore";
import { useUploadStore } from "@/store/uploadStore";
import { UpgradeModal } from "@/components/UpgradeModal";

const UploadJobs = () => {
  const t = useTranslations("uploadJobs");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploading = useUploadStore((s) => s.uploading);
  const setGlobalUploading = useUploadStore((s) => s.setUploading);
  const setProgressGlobal = useUploadStore((s) => s.setProgress);
  const [uploadEnabled, setUploadEnabled] = useState(true);

  const [ip, setIp] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const router = useRouter();
  const setJobResult = useJobResultStore((state) => state.setJobResult);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });

    fetch("/api/ip")
      .then((res) => res.json())
      .then((data) => {
        const ipAddr = data.ip;
        setIp(ipAddr);

        const count = localStorage.getItem(`upload-job-count-${ipAddr}`);
        const parsedCount = Number(count) || 0;
        setUploadCount(parsedCount);

        if (!auth.currentUser && parsedCount >= 5) {
          toast.warning(t("toast.uploadLimitReached"));
        }
      });

    return () => unsubscribe();
  }, []);

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
      toast.error(t("toast.selectCvFirst"));
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);

    let progressTicker: ReturnType<typeof setInterval> | null = null;

    try {
      setGlobalUploading(true, "job");
      setProgressGlobal(8);

      progressTicker = setInterval(() => {
        const current = useUploadStore.getState().progress;
        if (current >= 75) return;
        const next = Math.min(
          75,
          current + Math.max(1, Math.round((75 - current) * 0.12)),
        );
        setProgressGlobal(next);
      }, 350);

      // Langkah 2: Kirim ke backend untuk review
      const res = await fetch("/api/jobrecommend", {
        method: "POST",
        body: formData,
      });

      setProgressGlobal(82);

      if (!res.ok) {
        let errorMessage = t("errors.uploadOrAnalyzeFailed");
        let errData: any = {};
        try {
          errData = await res.json();
          errorMessage = errData?.message || errData?.error || errorMessage;
        } catch (_) {
          // Biarkan errorMessage default jika body JSON tidak ada
        }

        // Reset state sebelum menampilkan notifikasi
        setProgressGlobal(0);
        setGlobalUploading(false);
        if (progressTicker) clearInterval(progressTicker);
        progressTicker = null;

        // Tampilkan modal untuk 403, toast untuk lainnya
        if (res.status === 403 || errData?.requireUpgrade) {
          setUpgradeMessage(errorMessage);
          setShowUpgradeModal(true);
        } else {
          toast.error(errorMessage);
        }
        return; // Hentikan eksekusi
      }

      const responseData = await res.json();

      // ✅ Result asli dari Gradio / HuggingFace space ada di responseData.data.result.data array
      const apiResult = responseData?.data?.result || responseData?.result;
      const parsedData = apiResult?.data?.[0];

      if (!parsedData) {
        throw new Error(t("errors.resultNotFound"));
      }

      // Update global Zustand store
      setJobResult(parsedData);
      setProgressGlobal(93);
      toast.success(t("toast.recommendationCreated"));

      // batas upload guest
      if (!isLoggedIn) {
        const newCount = uploadCount + 1;
        setUploadCount(newCount);
        localStorage.setItem(`upload-job-count-${ip}`, String(newCount));
      }

      setProgressGlobal(100);
      await new Promise((resolve) => setTimeout(resolve, 320));
      router.push("/job-match/job-match-result");
      setGlobalUploading(false);
    } catch (err: any) {
      // Blok catch ini sekarang hanya untuk error network atau error tak terduga lainnya
      console.error(
        "❌ Upload gagal (Network/Unexpected):",
        err.message || err,
      );
      toast.error(err.message || t("errors.uploadOrAnalyzeFailed"));
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
        className={`relative flex h-52 items-center justify-center rounded-2xl border-3 border-dashed ${
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

      {/* Info batas upload */}
      <div className="mt-2 text-center text-sm text-gray-500">
        {!isLoggedIn && (
          <span>
            {t("remainingWithoutLogin", {
              remaining: Math.max(0, 5 - uploadCount),
            })}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-TextSecondary font-medium">{t("supportedFiles")}</p>
      </div>

      {/* Tombol Analisis */}
      <div className="mx-auto w-full pt-4 pb-12">
        <div className="flex justify-end lg:justify-start">
          <button
            onClick={handleUpload}
            disabled={uploading || (!isLoggedIn && uploadCount >= 5)}
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

export default UploadJobs;
