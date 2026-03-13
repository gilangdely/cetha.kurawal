"use client";

import { useState } from "react";
import { CvPreview } from "@/components/cv-preview";
import { FileDown, LayoutTemplate, PenLine, Undo2, Redo2 } from "lucide-react";
import FormBuildCv from "@/components/form-build-cv";
import { useCvBuilderStore } from "@/store/buildCvStore";

export default function CvBuilderPage() {
  const undo = useCvBuilderStore((state) => state.undo);
  const redo = useCvBuilderStore((state) => state.redo);
  const pastStates = useCvBuilderStore((state) => state.pastStates);
  const futureStates = useCvBuilderStore((state) => state.futureStates);

  // Mobile tab: "form" | "preview"
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50 print:h-auto print:overflow-visible print:bg-white">
      {/* ── Toolbar ── */}
      <div className="print-hidden flex shrink-0 items-center justify-between border-b bg-white px-3 py-2 sm:px-4 sm:py-3">
        {/* Left: Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => undo()}
            disabled={pastStates.length === 0}
            title="Undo"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Undo2 size={17} />
          </button>
          <button
            onClick={() => redo()}
            disabled={futureStates.length === 0}
            title="Redo"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <Redo2 size={17} />
          </button>
        </div>

        {/* Center: Mobile tab toggle (hidden md+) */}
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-100 p-1 md:hidden">
          <button
            onClick={() => setMobileTab("form")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              mobileTab === "form"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <PenLine size={13} />
            Form
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
            Preview
          </button>
        </div>

        {/* Right: Export button */}
        <button
          onClick={handleExportPdf}
          className="bg-primaryBlue hover:bg-primaryBlueHover flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-white transition-all"
        >
          <FileDown size={16} />
          <span className="hidden sm:inline">Export PDF</span>
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden print:block print:w-full print:px-0">
        {/* ── DESKTOP: side-by-side ── */}
        <div className="hidden md:flex md:flex-1 md:overflow-hidden md:px-4 md:py-6 lg:px-6 lg:py-8 print:flex print:w-full print:px-0 print:py-0">
          {/* Form sidebar */}
          <div className="print-hidden w-[300px] shrink-0 overflow-y-auto pr-4 lg:w-[350px]">
            <FormBuildCv />
          </div>

          {/* Preview */}
          <div className="flex flex-1 justify-center overflow-y-auto print:block print:overflow-visible">
            <div className="w-full max-w-[850px] shrink-0">
              <CvPreview />
            </div>
          </div>
        </div>

        {/* ── MOBILE: single pane, tab-controlled ── */}
        <div className="print-hidden flex flex-1 flex-col overflow-y-auto px-3 py-4 md:hidden">
          {mobileTab === "form" ? (
            <FormBuildCv />
          ) : (
            /* Preview: scale down to fit mobile screen */
            <div className="flex flex-col items-center">
              <CvPreview />
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
