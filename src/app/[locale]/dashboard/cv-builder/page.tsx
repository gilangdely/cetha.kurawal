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
      console.log("[Export] Initiating client-side PDF generation...");

      // 1. Sync Quota (Cut 2 tokens)
      const quotaResponse = await fetch("/api/cv-quota", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!quotaResponse.ok) {
        const errorData = await quotaResponse.json();
        throw new Error(errorData.message || t("errors.exportQuotaFailed") || "Gagal memotong token");
      }

      console.log("[Export] Quota synced. Rendering PDF...");

      // 2. Import react-pdf components dynamically to save bundle size
      const { pdf } = await import("@react-pdf/renderer");
      const { CvTemplatePdf } = await import("@/components/cv-templates/CvTemplatePdf");

      const data = useCvBuilderStore.getState().data;
      const style = useCvBuilderStore.getState().style;
      const templateName = useCvBuilderStore.getState().activeTemplate;
      const userName = data.personalInfo.fullName || "User";
      const fileName = `CV_${userName.replace(/\s+/g, "_")}_${templateName}.pdf`;

      // 3. Generate PDF Blob
      const blob = await pdf(<CvTemplatePdf data={data} templateSlug={templateName} style={style} />).toBlob();
      
      // 4. Download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(t("toast.exportSuccess") || "PDF berhasil diunduh");
      console.log("[Export] PDF generated and downloaded successfully on client.");
    } catch (error: any) {
      console.error("[Export Error] Failed to export PDF:", error);
      toast.error(error.message || t("errors.exportFailed") || "Gagal menghasilkan PDF");
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
              <SelectValue placeholder={t("selectMode")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="builder">{t("builderMode")}</SelectItem>
              <SelectItem value="template">{t("templateMode")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden w-full items-center rounded-xl bg-gray-100 p-1 lg:flex">
          <button
            onClick={() => setDesktopTab("builder")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              desktopTab === "builder"
                ? "bg-primaryBlue text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("builderMode")}
          </button>

          <button
            onClick={() => setDesktopTab("template")}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
              desktopTab === "template"
                ? "bg-primaryBlue text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("templateMode")}
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
              <span className="hidden sm:inline">{t("preparingPdf")}</span>
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
          <section className="min-h-0 min-w-0 flex-1 overflow-auto rounded-2xl bg-gray-100/30 p-4 lg:p-6 print:block print:overflow-visible print:border-0 print:bg-transparent print:p-0">
            <div className="mx-auto w-fit max-w-[900px] min-w-full">
              <CvPreview />
            </div>
          </section>
        </div>

        {/* ── MOBILE: single pane, tab-controlled ── */}
        <div className="print-hidden flex min-h-0 flex-1 flex-col overflow-y-auto bg-white lg:hidden">
          {mobileTab === "form" ? (
            renderEditorPanel()
          ) : (
            /* Preview: scrollable both axes on mobile */
            <div className="flex min-h-0 flex-1 flex-col items-center overflow-auto bg-gray-50/50 p-3">
              <div className="w-fit max-w-[420px] min-w-full">
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
