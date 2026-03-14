import { useCvBuilderStore } from "../store/buildCvStore";
import { ClassicAts } from "./cv-templates/classic-ats";
import { ModernAts } from "./cv-templates/modern-ats";
import { MinimalAts } from "./cv-templates/minimal-ats";
import { CreativeModernTemplate } from "./cv-templates/creative-modern";
import { ExecutiveMinimalistTemplate } from "./cv-templates/executive-minimalist";
import { CompactProfessionalTemplate } from "./cv-templates/compact-professional";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COLORS = [
  "#000000",
  "#374151",
  "#1F2937",
  "#111827",
  "#2563EB",
  "#059669",
  "#DC2626",
];

export const CvPreview = () => {
  const { data, activeTemplate, style, setFontFamily, setFontColor } =
    useCvBuilderStore();

  const renderTemplate = () => {
    switch (activeTemplate) {
      case "classic":
        return <ClassicAts data={data} style={style} />;
      case "modern":
        return <ModernAts data={data} style={style} />;
      case "minimal":
        return <MinimalAts data={data} style={style} />;
      case "creative-modern":
        return <CreativeModernTemplate data={data} style={style} />;
      case "executive-minimalist":
        return <ExecutiveMinimalistTemplate data={data} style={style} />;
      case "compact-professional":
        return <CompactProfessionalTemplate data={data} style={style} />;
      default:
        return <ModernAts data={data} style={style} />;
    }
  };

  return (
    <div className="flex w-full flex-col items-center overflow-y-auto print:overflow-visible">
      {/* Style & Template Toolbar */}
      <div className="mb-4 flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1.5 print:hidden">
        {/* Font Dropdown */}
        <Select
          value={style.fontFamily}
          onValueChange={(value) => setFontFamily(value)}
        >
          <SelectTrigger className="h-8 border-0 bg-transparent text-sm font-medium shadow-none hover:bg-gray-200 focus:ring-0">
            <SelectValue placeholder="Font" />
          </SelectTrigger>

          <SelectContent side="bottom" position="popper">
            <SelectItem value="Inter">Inter</SelectItem>
            <SelectItem value="Poppins">Poppins</SelectItem>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
          </SelectContent>
        </Select>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-gray-300/70" />

        {/* Color Selector */}
        <div className="flex items-center gap-1 px-1">
          {COLORS.map((color) => {
            const active = style.fontColor === color;

            return (
              <button
                key={color}
                onClick={() => setFontColor(color)}
                className={`h-6 w-6 rounded-full border transition-all duration-200 ${
                  active
                    ? "-translate-y-[2px] border-gray-300 shadow-sm"
                    : "border-transparent opacity-80 hover:-translate-y-[1px] hover:bg-gray-200 hover:opacity-100"
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>
      </div>

      {/* CV Preview */}
      <div className="flex w-full justify-center overflow-x-hidden pb-4 print:block print:pb-0">
        <div className="origin-top scale-[0.45] transition-transform sm:scale-[0.65] md:scale-[0.8] lg:scale-90 xl:scale-100 print:scale-100 print:transform-none">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
