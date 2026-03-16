import { useCvBuilderStore } from "@/store/buildCvStore";
import { motion } from "framer-motion";
import { CheckCircle2, LayoutTemplate } from "lucide-react";
import { useTranslations } from "next-intl";

const TEMPLATES = [
  { id: "modern", key: "modern" },
  { id: "minimal", key: "minimal" },
  { id: "classic", key: "classic" },
  { id: "creative-modern", key: "creativeModern" },
  { id: "executive-minimalist", key: "executiveMinimalist" },
  // { id: "compact-professional", key: "compactProfessional" },
] as const;

export const TemplateGallery = () => {
  const t = useTranslations("dashboard.templateGallery");
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
        <h2
          className="text-xl font-extrabold tracking-tight text-gray-900"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {t("title")}
        </h2>
        <p className="mt-1 text-sm text-gray-500">{t("description")}</p>
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
              className={`relative flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border p-4 text-center transition-all duration-300 ${isActive
                  ? "border-primaryBlue ring-primaryBlue/20 bg-blue-50/50 shadow-md ring-1"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
            >
              {/* Badge Active */}
              {isActive && (
                <div className="absolute top-3 right-3">
                  <CheckCircle2 className="text-primaryBlue h-5 w-5" />
                </div>
              )}

              {/* Icon / Abstract Preview */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${isActive
                    ? "bg-primaryBlue/10 text-primaryBlue"
                    : "bg-gray-100 text-gray-400"
                  }`}
              >
                <LayoutTemplate size={24} />
              </div>

              <div>
                <h3
                  className={`text-sm font-bold ${isActive ? "text-primaryBlue" : "text-gray-700"}`}
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {t(`templates.${tmpl.key}.name`)}
                </h3>
                <p className="mt-1 line-clamp-2 px-1 text-[11px] leading-tight text-gray-500">
                  {t(`templates.${tmpl.key}.description`)}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
