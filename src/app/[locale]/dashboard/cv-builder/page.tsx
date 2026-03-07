"use client";

import { useCvBuilderStore } from "@/features/cv-builder/store";
import { CvForm } from "@/features/cv-builder/components/CvForm";
import { CvPreview } from "@/features/cv-builder/components/CvPreview";
import { Button } from "@/components/ui/button";
import { FileDown, LayoutTemplate } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CvBuilderPage() {
    const { activeTemplate, setTemplate } = useCvBuilderStore();

    const handleExportPdf = () => {
        window.print();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-gray-50 overflow-hidden print:h-auto print:overflow-visible print:bg-white">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b shrink-0 print:hidden">
                <div>
                    <h1 className="text-xl font-bold text-gray-800">CV Builder ATS</h1>
                    <p className="text-sm text-gray-500">Isi data dan download CV format ATS Friendly secara instan.</p>
                </div>
                <div className="flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2">
                                <LayoutTemplate size={16} />
                                <span className="hidden sm:inline">Template: {activeTemplate}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTemplate("modern")}>
                                Modern ATS {activeTemplate === "modern" && "✓"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTemplate("classic")}>
                                Classic ATS {activeTemplate === "classic" && "✓"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTemplate("minimal")}>
                                Minimal ATS {activeTemplate === "minimal" && "✓"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button onClick={handleExportPdf} className="bg-primaryBlue hover:bg-primaryBlueHover text-white gap-2">
                        <FileDown size={16} />
                        <span className="hidden sm:inline">Export PDF</span>
                    </Button>
                </div>
            </div>

            {/* Main Content: Split View */}
            <div className="flex flex-1 overflow-hidden print:overflow-visible">
                {/* Left Column: Form Builder */}
                <div className="flex-1 w-full lg:max-w-xl border-r border-gray-200 bg-white overflow-y-auto print:hidden">
                    <div className="p-4 lg:p-6 pb-20">
                        <CvForm />
                    </div>
                </div>

                {/* Right Column: PDF Preview */}
                <div className="flex-[1.5] hidden md:block bg-gray-100 overflow-y-auto print:block print:w-full print:bg-white print:overflow-visible">
                    <CvPreview />
                </div>
            </div>

            {/* Mobile Preview Button Overlay (only visible on mobile) */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 print:hidden">
                <Button onClick={handleExportPdf} className="w-full bg-primaryBlue shadow-lg h-12 text-white gap-2 rounded-full">
                    <FileDown size={18} />
                    Export to PDF (via Print)
                </Button>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-cv, .print-cv * {
            visibility: visible;
          }
          .print-cv {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}} />
        </div>
    );
}
