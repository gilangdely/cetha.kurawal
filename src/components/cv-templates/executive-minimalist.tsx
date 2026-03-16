import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

// Description: multi-line → diamond bullet list, single → plain italic
const Description = ({ text }: { text: string }) => {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className="mt-1.5 text-[13px] leading-relaxed text-stone-600 whitespace-pre-wrap">
        {text}
      </p>
    );
  }

  return (
    <ul className="mt-1.5 space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-stone-600">
          <span className="mt-[3px] shrink-0 text-[8px] text-amber-500">◆</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
};

// Section divider: centered label flanked by rules
const SectionDivider = ({ label }: { label: string }) => (
  <div className="mb-6 flex items-center gap-4">
    <div className="h-px flex-1 bg-stone-200" />
    <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-500 whitespace-nowrap">
      {label}
    </h3>
    <div className="h-px flex-1 bg-stone-200" />
  </div>
);

// Left-aligned section divider (for bottom grid)
const SectionDividerLeft = ({ label }: { label: string }) => (
  <div className="mb-5 flex items-center gap-4">
    <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-500 whitespace-nowrap">
      {label}
    </h3>
    <div className="h-px flex-1 bg-stone-200" />
  </div>
);

export const ExecutiveMinimalistTemplate = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  return (
    <div
      className="cv-document relative mx-auto min-h-[297mm] w-[210mm] overflow-hidden bg-[#fafaf8] px-12 py-10 shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily || "'Manrope', sans-serif",
        color: style.fontColor || "#1c1917",
      }}
    >
      {/* Top accent bar */}


      {/* ── HEADER ── */}
      <header className="mb-4 border-b border-stone-200 pb-7 text-center">
        {/* Eyebrow label */}
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[4px] text-amber-700">
          Curriculum Vitae
        </p>

        {/* Photo */}
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile"
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-2 ring-amber-200 ring-offset-2"
          />
        )}

        {/* Name */}
        <h1
          className="text-[32px] font-black uppercase tracking-[3px] text-stone-900 leading-none mb-2"
          style={{ fontFamily: "'Manrope', sans-serif" }}
        >
          {data.personalInfo.fullName || "Nama Lengkap"}
        </h1>

        {/* Job Title */}
        {data.personalInfo.jobTitle && (
          <h2 className="mt-2 text-[11px] font-semibold uppercase tracking-[3px] text-amber-500">
            {data.personalInfo.jobTitle}
          </h2>
        )}

        {/* Contact row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-0 gap-y-1 text-[11px] font-medium tracking-wide text-stone-500">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && (
            <>
              <span className="mx-3 text-stone-300">|</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.email && (
            <>
              <span className="mx-3 text-stone-300">|</span>
              <span>{data.personalInfo.email}</span>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span className="mx-3 text-stone-300">|</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* ── SUMMARY ── */}
      {data.personalInfo.summary && (
        <section className="mb-4 text-center">
          <p className="mx-auto max-w-lg text-[13px] italic leading-loose text-stone-500 whitespace-pre-wrap">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <SectionDivider label="Pengalaman Profesional" />

          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div
                key={exp.id}
                className={i < data.experience.length - 1 ? "border-b border-stone-100 pb-6" : ""}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="text-[15px] font-black uppercase tracking-wide text-stone-900">
                    {exp.role}
                  </h4>
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                    {exp.startDate} — {exp.endDate || "Sekarang"}
                  </span>
                </div>

                <div className="mt-1 mb-2 text-[12px] font-bold text-amber-500">
                  {exp.company}
                  {exp.location && (
                    <span className="font-normal text-stone-400"> · {exp.location}</span>
                  )}
                </div>

                {exp.description && <Description text={exp.description} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── BOTTOM GRID: Education + Skills ── */}
      <div className="flex flex-col gap-8">

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <SectionDividerLeft label="Pendidikan" />
            <div className="space-y-5">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-[14px] font-bold leading-tight text-stone-900">
                    {edu.degree}
                    {edu.fieldOfStudy && (
                      <span className="font-normal text-stone-500"> dalam {edu.fieldOfStudy}</span>
                    )}
                  </h4>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-[12px] font-semibold text-stone-500">
                      {edu.institution}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {edu.startDate} — {edu.endDate || "Sekarang"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-stone-400 whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <SectionDividerLeft label="Keahlian" />
            <ul className="grid grid-cols-1 gap-y-2">
              {data.skills.map((skill) => (
                <li key={skill.id} className="flex items-center gap-2 text-[13px] font-medium text-stone-600">
                  <span className="text-[8px] text-amber-400">◆</span>
                  {skill.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

    </div>
  );
};