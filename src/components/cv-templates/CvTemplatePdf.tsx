import { Document, Font } from "@react-pdf/renderer";
import { ResumeData } from "@/types/build-cv";
import { ModernAtsPdf } from "./pdf-templates/ModernAtsPdf";
import { ClassicAtsPdf } from "./pdf-templates/ClassicAtsPdf";
import { MinimalAtsPdf } from "./pdf-templates/MinimalAtsPdf";
import { CreativeModernPdf } from "./pdf-templates/CreativeModernPdf";
import { ExecutiveMinimalistPdf } from "./pdf-templates/ExecutiveMinimalistPdf";
import { CompactProfessionalPdf } from "./pdf-templates/CompactProfessionalPdf";

// Register Fonts with Absolute Paths
Font.register({
  family: "Manrope",
  fonts: [
    { src: "/fonts/Manrope-Regular.ttf", fontWeight: 400 },
    { src: "/fonts/Manrope-Bold.ttf", fontWeight: 700 },
  ],
});

// Implementation of Official hyphenationCallback to prevent weird word breaks
Font.registerHyphenationCallback((word) => [word]);

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const CvTemplatePdf = ({ 
  data, 
  templateSlug, 
  style 
}: { 
  data: ResumeData; 
  templateSlug: string;
  style: CvStyle;
}) => {
  const renderTemplate = () => {
    switch (templateSlug) {
      case "modern":
        return <ModernAtsPdf data={data} style={style} />;
      case "classic":
        return <ClassicAtsPdf data={data} style={style} />;
      case "minimal":
        return <MinimalAtsPdf data={data} style={style} />;
      case "creative-modern":
        return <CreativeModernPdf data={data} style={style} />;
      case "executive-minimalist":
        return <ExecutiveMinimalistPdf data={data} style={style} />;
      case "compact-professional":
        return <CompactProfessionalPdf data={data} style={style} />;
      default:
        return <ModernAtsPdf data={data} style={style} />;
    }
  };

  return (
    <Document 
      title={`CV - ${data.personalInfo.fullName}`} 
      author="Cetha Kurawal"
      creator="Cetha PDF Engine Official Docs Sync"
    >
      {renderTemplate()}
    </Document>
  );
};
