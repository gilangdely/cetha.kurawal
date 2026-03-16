import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

// Description: multi-line → bullet list, single → plain text
const Description = ({ text }: { text: string }) => {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className="mt-2 text-[11.5px] leading-relaxed opacity-80 whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  return (
    <ul className="mt-2 space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-[11.5px] leading-relaxed opacity-80">
          <span className="mt-0.5 shrink-0 text-slate-400">–</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
};

export const CreativeModernTemplate = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  const primaryColor = style.fontColor || "#2563eb";

  return (
    <div
      className="cv-document mx-auto flex min-h-[297mm] h-fit md:h-[297mm] w-[210mm] bg-white shadow-sm print:shadow-none font-sans"
      style={{ fontFamily: style.fontFamily }}
    >
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0 !important;
              padding: 0 !important;
              background-color: white !important;
            }
            .cv-document {
              margin: 0 !important;
              box-shadow: none !important;
              width: 210mm !important;
              height: 297mm !important;
              page-break-after: avoid !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>
      {/* ── SIDEBAR (32%) ── */}
      <aside className="w-[32%] shrink-0 p-7 flex flex-col" style={{ backgroundColor: "#1e3a5f" }}>

        {/* Photo */}
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl ? (
          <div className="flex justify-center mb-5">
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover border-[2.5px] border-white"
            />
          </div>
        ) : (
          <div className="flex justify-center mb-5">
            <div className="h-20 w-20 rounded-full" style={{ backgroundColor: "#2d4f7a" }} />
          </div>
        )}

        {/* Name + Job Title */}
        <h1 className="text-[18.5px] font-extrabold text-center text-slate-50 leading-tight mb-1">
          {data.personalInfo.fullName || "Nama Lengkap"}
        </h1>
        {data.personalInfo.jobTitle && (
          <h2
            className="text-[10px] font-semibold text-center uppercase tracking-[1.4px] mb-5"
            style={{ color: "#93c5fd" }}
          >
            {data.personalInfo.jobTitle}
          </h2>
        )}

        {/* Contact */}
        {(data.personalInfo.email ||
          data.personalInfo.phone ||
          data.personalInfo.location ||
          data.personalInfo.linkedin ||
          data.personalInfo.portfolio) && (
            <div className="mb-5">
              <h3
                className="text-[8.5px] font-bold uppercase tracking-[1.8px] mb-2"
                style={{ color: "#64748b" }}
              >
                Kontak
              </h3>
              <div className="h-px mb-2" style={{ backgroundColor: "#2d4f7a" }} />
              <ul className="space-y-1.5">
                {data.personalInfo.email && (
                  <li className="text-[10.5px] break-all" style={{ color: "#cbd5e1" }}>{data.personalInfo.email}</li>
                )}
                {data.personalInfo.phone && (
                  <li className="text-[10.5px]" style={{ color: "#cbd5e1" }}>{data.personalInfo.phone}</li>
                )}
                {data.personalInfo.location && (
                  <li className="text-[10.5px]" style={{ color: "#cbd5e1" }}>{data.personalInfo.location}</li>
                )}
                {data.personalInfo.linkedin && (
                  <li className="text-[10.5px] break-all" style={{ color: "#cbd5e1" }}>{data.personalInfo.linkedin}</li>
                )}
                {data.personalInfo.portfolio && (
                  <li className="text-[10.5px] break-all" style={{ color: "#cbd5e1" }}>{data.personalInfo.portfolio}</li>
                )}
              </ul>
            </div>
          )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div>
            <h3
              className="text-[8.5px] font-bold uppercase tracking-[1.8px] mb-2"
              style={{ color: "#64748b" }}
            >
              Keahlian
            </h3>
            <div className="h-px mb-2" style={{ backgroundColor: "#2d4f7a" }} />
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-[3px] px-2 py-1 text-[10px] font-semibold"
                  style={{ backgroundColor: "#2d4f7a", color: "#93c5fd" }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN (68%) ── */}
      <main className="flex-1 p-7" style={{ color: style.fontColor }}>

        {/* Profile */}
        {data.personalInfo.summary && (
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-[3px] w-4 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-slate-900">
                Profil
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <p className="text-[12.5px] leading-relaxed opacity-90 whitespace-pre-wrap text-slate-600">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-[3px] w-4 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-slate-900">
                Pengalaman
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-3">
              {data.experience.map((exp) => (
                <div key={exp.id} className="flex gap-2.5">
                  {/* Workaround dot → div solid */}
                  <div
                    className="mt-1 shrink-0 w-[3px] self-stretch rounded-sm"
                    style={{ backgroundColor: primaryColor + "40" }}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="text-[13.5px] font-bold text-slate-900 leading-tight">
                        {exp.role}
                      </span>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        {exp.startDate} – {exp.endDate || "Sekarang"}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-semibold text-slate-500 mb-1">
                      {exp.company}{exp.location ? ` • ${exp.location}` : ""}
                    </div>
                    {exp.description && <Description text={exp.description} />}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-2.5">
              <div className="h-[3px] w-4 rounded-sm" style={{ backgroundColor: primaryColor }} />
              <h3 className="text-[11.5px] font-bold uppercase tracking-[1.4px] text-slate-900">
                Pendidikan
              </h3>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex gap-2.5">
                  <div
                    className="mt-1 shrink-0 w-[3px] self-stretch rounded-sm"
                    style={{ backgroundColor: primaryColor + "40" }}
                  />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-2 mb-0.5">
                      <span className="text-[13.5px] font-bold text-slate-900 leading-tight">
                        {edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                      </span>
                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        {edu.startDate} – {edu.endDate || "Sekarang"}
                      </span>
                    </div>
                    <div className="text-[11.5px] font-semibold text-slate-500">
                      {edu.institution}
                    </div>
                    {edu.description && <Description text={edu.description} />}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};