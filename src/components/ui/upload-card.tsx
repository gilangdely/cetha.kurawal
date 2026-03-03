import React from "react";
import { Upload } from "lucide-react";

const UploadCard: React.FC = () => {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center gap-4 rounded-full border border-dashed border-neutral-300/70 bg-white px-6 py-4">
        <Upload className="text-primaryBlue/90 h-5 w-5" />

        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-sm font-semibold text-neutral-800">
            Click to upload or drag & drop
          </span>
          <span className="text-xs text-neutral-500">
            PDF, DOC, DOCX · Max 5MB
          </span>
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
