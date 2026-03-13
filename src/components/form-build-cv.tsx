import { useState } from "react";
import CvBuildAccordion from "./cv-build-accordion";
import CvTemplateSelector from "./cv-template-selector";

export default function FormBuildCv() {
  const [activeTab, setActiveTab] = useState<"builder" | "templates">(
    "builder",
  );

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-4 flex rounded-lg bg-gray-200 p-1">
        <button
          onClick={() => setActiveTab("builder")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
            activeTab === "builder"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-500"
          }`}
        >
          Builder
        </button>

        <button
          onClick={() => setActiveTab("templates")}
          className={`flex-1 rounded-md py-1.5 text-sm font-medium transition ${
            activeTab === "templates"
              ? "bg-white text-gray-900 shadow"
              : "text-gray-500"
          }`}
        >
          Templates
        </button>
      </div>

      {activeTab === "builder" ? <CvBuildAccordion /> : <CvTemplateSelector />}
    </div>
  );
}
