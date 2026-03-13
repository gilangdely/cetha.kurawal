import { useCvBuilderStore } from "@/store/buildCvStore";
import { Check } from "lucide-react";

export default function CvTemplateSelector() {
  const activeTemplate = useCvBuilderStore((s) => s.activeTemplate);
  const setTemplate = useCvBuilderStore((s) => s.setTemplate);

  return (
    <div className="grid grid-cols-1 gap-3">
      {/* Modern */}
      <button
        onClick={() => setTemplate("modern")}
        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
          activeTemplate === "modern"
            ? "border-primaryBlue bg-blue-50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div>
          <p className="text-sm font-medium">Modern ATS</p>
          <p className="text-xs text-gray-500">
            Clean layout optimized for ATS systems
          </p>
        </div>

        {activeTemplate === "modern" && (
          <Check size={16} className="text-primaryBlue" />
        )}
      </button>

      {/* Classic */}
      <button
        onClick={() => setTemplate("classic")}
        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
          activeTemplate === "classic"
            ? "border-primaryBlue bg-blue-50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div>
          <p className="text-sm font-medium">Classic ATS</p>
          <p className="text-xs text-gray-500">Traditional resume layout</p>
        </div>

        {activeTemplate === "classic" && (
          <Check size={16} className="text-primaryBlue" />
        )}
      </button>

      {/* Minimal */}
      <button
        onClick={() => setTemplate("minimal")}
        className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
          activeTemplate === "minimal"
            ? "border-primaryBlue bg-blue-50"
            : "border-gray-200 hover:bg-gray-50"
        }`}
      >
        <div>
          <p className="text-sm font-medium">Minimal ATS</p>
          <p className="text-xs text-gray-500">Simple minimal design</p>
        </div>

        {activeTemplate === "minimal" && (
          <Check size={16} className="text-primaryBlue" />
        )}
      </button>
    </div>
  );
}
