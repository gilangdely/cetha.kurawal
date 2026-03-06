import { useCvBuilderStore } from "../store";
import { ClassicAts } from "../templates/ClassicAts";
import { ModernAts } from "../templates/ModernAts";
import { MinimalAts } from "../templates/MinimalAts";

export const CvPreview = () => {
    const { data, activeTemplate } = useCvBuilderStore();

    const renderTemplate = () => {
        switch (activeTemplate) {
            case "classic":
                return <ClassicAts data={data} />;
            case "modern":
                return <ModernAts data={data} />;
            case "minimal":
                return <MinimalAts data={data} />;
            default:
                return <ModernAts data={data} />;
        }
    };

    return (
        <div className="w-full bg-gray-100 flex justify-center p-4 lg:p-8 min-h-screen overflow-y-auto">
            <div className="w-full max-w-[210mm] border border-gray-200 shadow-xl bg-white origin-top sm:scale-[0.8] md:scale-90 lg:scale-100 print:scale-100 print:shadow-none print:border-none print:m-0 print:p-0 transition-transform">
                {renderTemplate()}
            </div>
        </div>
    );
};
