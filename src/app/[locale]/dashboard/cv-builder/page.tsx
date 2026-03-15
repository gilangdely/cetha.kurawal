"use client";

import { useState, useEffect } from "react";
import { CvPreview } from "@/components/cv-preview";
import {
  FileDown,
  LayoutTemplate,
  PenLine,
  Undo2,
  Redo2,
  Loader2,
} from "lucide-react";
import FormBuildCv from "@/components/form-build-cv";
import { TemplateGallery } from "@/components/template-gallery";
import { useCvBuilderStore } from "@/store/buildCvStore";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CvBuilderPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = useTranslations("dashboard.cvBuilder");
  const undo = useCvBuilderStore((state) => state.undo);
  const redo = useCvBuilderStore((state) => state.redo);
  const pastStates = useCvBuilderStore((state) => state.pastStates);
  const futureStates = useCvBuilderStore((state) => state.futureStates);

  // Mobile tab: "form" | "preview"
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [desktopTab, setDesktopTab] = useState<"builder" | "template">(
    "builder",
  );
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      console.log("[Export] Memulai proses persiapan Export PDF...");

      // Dinamis Import agar server tidak komplain
      const htmlToImage = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const element = document.querySelector(".cv-document") as HTMLElement;
      if (!element) throw new Error("Document structure not found");

      console.log("[Export] Menunggu kesiapan Font Manrope...");
      await document.fonts.ready;

      // Hapus efek scale pada origin element sementara waktu untuk capture yang sempurna
      // Kita asumsikan element punya parent pembungkus yang melakukan transform scale
      const parentWrapper = element.parentElement;
      const originalTransform = parentWrapper?.style.transform || "";

      if (parentWrapper) {
        parentWrapper.style.transform = "none";
        parentWrapper.style.transition = "none"; // Matikan transisi agar tidak capture animasi
      }

      console.log(
        "[Export] Membangun Image Data dari DOM via html-to-image...",
      );

      const imgData = await htmlToImage.toJpeg(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      // Kembalikan style parent seperti semula
      if (parentWrapper) {
        parentWrapper.style.transform = originalTransform;
        parentWrapper.style.transition = "";
      }

      console.log(
        "[Export] Canvas selesai digenerate. Mempersiapkan Image Data...",
      );

      console.log("[Export] Inisialisasi library jsPDF...");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.scrollHeight * pdfWidth) / element.scrollWidth;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);

      const userName =
        useCvBuilderStore.getState().data.personalInfo.fullName || "User";
      const templateName = useCvBuilderStore.getState().activeTemplate;

      const fileName = `CV_${userName.replace(/\s+/g, "_")}_${templateName}.pdf`;
      console.log(`[Export] Memicu fungsi download: ${fileName}`);

      pdf.save(fileName);
      toast.success("PDF berhasil diunduh");
      console.log("[Export] File berhasil diunduh.");
    } catch (error: any) {
      console.error("[Export Error] Gagal melakukan export PDF:", error);
      toast.error(error.message || "Gagal menghasilkan file PDF");
    } finally {
      setIsExporting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const renderEditorPanel = () => (
    <div className="flex h-full min-h-0 w-full flex-col">
      {/* Header controls: select on mobile/tablet, button tabs on desktop */}
      <div className="sticky top-0 z-10 border-b border-gray-100 bg-white px-4 py-4 md:px-6 md:py-5">
        <div className="lg:hidden">
          <Select
            value={desktopTab}
            onValueChange={(value: "builder" | "template") =>
              setDesktopTab(value)
            }
          >
            <SelectTrigger className="h-10 rounded-xl border-gray-200 bg-white text-sm font-semibold">
              <SelectValue placeholder="Pilih mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="builder">Data Builder</SelectItem>
              <SelectItem value="template">Pilih Template</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={() => setDesktopTab("builder")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              desktopTab === "builder"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Data Builder
          </button>
          <button
            onClick={() => setDesktopTab("template")}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              desktopTab === "template"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pilih Template
          </button>
        </div>
      </div>

      {/* Sidebar Content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 md:px-5 lg:px-6 lg:py-6">
        {desktopTab === "builder" ? <FormBuildCv /> : <TemplateGallery />}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50 print:h-auto print:overflow-visible print:bg-white">
      {/* ── Toolbar ── */}
      <div className="print-hidden flex shrink-0 items-center justify-between border-b bg-white px-3 py-2 sm:px-4 sm:py-3">
        {/* Left: Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            title={t("undo")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Undo2 size={17} />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            title={t("redo")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Redo2 size={17} />
          </button>
        </div>

        {/* Center: Mobile+tablet tab toggle (hidden lg+) */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 lg:hidden">
          <button
            onClick={() => setMobileTab("form")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mobileTab === "form"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PenLine size={13} />
            {t("form")}
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mobileTab === "preview"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutTemplate size={13} />
            {t("preview")}
          </button>
        </div>

        {/* Right: Export button */}
        <button
          onClick={handleExportPdf}
          disabled={isExporting}
          className="bg-primaryBlue hover:bg-primaryBlueHover flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isExporting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Menyiapkan PDF...</span>
            </>
          ) : (
            <>
              <FileDown size={16} />
              <span className="hidden sm:inline">{t("exportPdf")}</span>
            </>
          )}
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden print:block print:w-full print:px-0">
        {/* ── DESKTOP: side-by-side ── */}
        <div className="hidden min-h-0 lg:flex lg:flex-1 lg:gap-6 lg:overflow-hidden lg:px-6 lg:py-8 print:flex print:w-full print:px-0 print:py-0">
          {/* Sidebar with builder/template tabs */}
          <aside className="print-hidden min-h-0 w-full max-w-[460px] min-w-[320px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
            {renderEditorPanel()}
          </aside>

          {/* Preview area */}
          <section className="min-h-0 min-w-0 flex-1 overflow-y-auto rounded-2xl bg-gray-100/30 p-4 lg:p-6 print:block print:overflow-visible print:border-0 print:bg-transparent print:p-0">
            <div className="mx-auto w-full max-w-[900px]">
              <CvPreview />
            </div>
          </section>
        </div>

        {/* ── MOBILE: single pane, tab-controlled ── */}
        <div className="print-hidden flex min-h-0 flex-1 flex-col overflow-y-auto bg-white lg:hidden">
          {mobileTab === "form" ? (
            renderEditorPanel()
          ) : (
            /* Preview: scale down to fit mobile screen */
            <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto bg-gray-50/50 p-3">
              <div className="w-full max-w-[420px]">
                <CvPreview />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Print styles ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          /* hide UI builder */
          .print-hidden {
            display: none !important;
          }

          /* reset page */
          body {
            background: white;
          }

          /* show CV */
          .cv-document {
            position: relative;
            width: 210mm !important;
            min-height: 297mm !important;
            margin: 0 auto;
            box-shadow: none !important;
            transform: none !important;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

        }
      `,
        }}
      />
    </div>
  );
}
