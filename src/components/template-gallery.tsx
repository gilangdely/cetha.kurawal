import { useCvBuilderStore } from "@/store/buildCvStore";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutTemplate } from "lucide-react";

const TEMPLATES = [
  { id: "modern", name: "Modern ATS", description: "Rapi, profesional, satu kolom." },
  { id: "minimal", name: "Minimal ATS", description: "Bersih, fokus pada konten." },
  { id: "classic", name: "Classic ATS", description: "Format tradisional yang aman." },
  { id: "creative-modern", name: "Creative Modern", description: "Asimetris dengan aksen warna." },
  { id: "executive-minimalist", name: "Executive Minimalist", description: "Elegan dengan aksen oranye." },
  { id: "compact-professional", name: "Compact Pro", description: "Kepadatan tinggi untuk 1 lembar." },
] as const;

export const TemplateGallery = () => {
  const activeTemplate = useCvBuilderStore((state) => state.activeTemplate);
  const setTemplate = useCvBuilderStore((state) => state.setTemplate);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
          Pilih Template CV
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Pilih desain yang paling sesuai dengan industri dan pengalaman Anda. Semua template dioptimalkan untuk ATS.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isActive = activeTemplate === tmpl.id;

          return (
            <motion.button
              key={tmpl.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setTemplate(tmpl.id)}
              className={`relative flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300 ${
                isActive
                  ? "border-primaryBlue bg-blue-50/50 shadow-md ring-1 ring-primaryBlue/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {/* Badge Active */}
              {isActive && (
                <div className="absolute right-3 top-3">
                  <CheckCircle2 className="h-5 w-5 text-primaryBlue" />
                </div>
              )}

              {/* Icon / Abstract Preview */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  isActive ? "bg-primaryBlue/10 text-primaryBlue" : "bg-gray-100 text-gray-400"
                }`}
              >
                <LayoutTemplate size={24} />
              </div>

              <div>
                <h3 className={`text-sm font-bold ${isActive ? "text-primaryBlue" : "text-gray-700"}`} style={{ fontFamily: "'Manrope', sans-serif" }}>
                  {tmpl.name}
                </h3>
                <p className="mt-1 text-[11px] leading-tight text-gray-500 line-clamp-2 px-1">
                  {tmpl.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
