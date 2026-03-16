import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

const Description = ({ text }: { text: string }) => {
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return (
      <p className="text-[13px] leading-relaxed whitespace-pre-wrap opacity-90">
        {text}
      </p>
    );
  }

  return (
    <ul className="mt-1 space-y-1">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2 text-[13px] leading-relaxed opacity-90">
          <span className="mt-0.5 shrink-0 text-gray-400">-</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  );
};

export const ClassicAts = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  const contactItems = [
    data.personalInfo.email,
    data.personalInfo.phone,
    data.personalInfo.location,
    data.personalInfo.linkedin,
    data.personalInfo.portfolio,
  ].filter(Boolean);

  return (
    <div
      className="cv-document mx-auto min-h-[297mm] w-[210mm] bg-white px-12 py-11 shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily,
        color: style.fontColor,
      }}
    >
      {/* ── HEADER ── */}
      {data.personalInfo.showPhoto && data.personalInfo.photoUrl ? (
        // dengan foto: flex row
        <header
          className="mb-6 flex items-center gap-6 border-b-2 border-current pb-5"
        >
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile Photo"
            className="h-16 w-16 shrink-0 rounded object-cover"
          />
          <div className="flex-1">
            <h1 className="mb-1.5 text-[22px] font-extrabold uppercase tracking-[1.5px] leading-none">
              {data.personalInfo.fullName || "Nama Lengkap"}
            </h1>
            {data.personalInfo.jobTitle && (
              <h2 className="mb-2.5 text-[10px] font-medium tracking-[0.5px] opacity-60">
                {data.personalInfo.jobTitle}
              </h2>
            )}
            <div className="flex flex-wrap gap-x-1 gap-y-0.5 text-[8.5px] font-medium opacity-70">
              {contactItems.map((item, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-gray-300">|</span>}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </header>
      ) : (
        // tanpa foto: centered
        <header className="mb-6 border-b-2 border-current pb-5 text-center">
          <h1 className="mb-1.5 text-[22px] font-extrabold uppercase tracking-[1.5px] leading-none">
            {data.personalInfo.fullName || "Nama Lengkap"}
          </h1>
          {data.personalInfo.jobTitle && (
            <h2 className="mb-2.5 text-[10px] font-medium tracking-[0.5px] opacity-60">
              {data.personalInfo.jobTitle}
            </h2>
          )}
          <div className="flex flex-wrap justify-center gap-x-1 gap-y-0.5 text-[8.5px] font-medium opacity-70">
            {contactItems.map((item, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300">|</span>}
                {item}
              </span>
            ))}
          </div>
        </header>
      )}

      {/* ── SUMMARY ── */}
      {data.personalInfo.summary && (
        <section className="mb-5">
          <h3 className="mb-2.5 border-b border-current pb-1 text-[8.5px] font-bold uppercase tracking-[1.5px]">
            Professional Summary
          </h3>
          <p className="text-[13px] leading-relaxed whitespace-pre-wrap opacity-90">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* ── EXPERIENCE ── */}
      {data.experience.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-2.5 border-b border-current pb-1 text-[8.5px] font-bold uppercase tracking-[1.5px]">
            Work Experience
          </h3>
          <div className="flex flex-col">
            {data.experience.map((exp, i) => (
              <div
                key={exp.id}
                className={
                  i < data.experience.length - 1
                    ? "mb-3 border-b border-gray-100 pb-3"
                    : ""
                }
              >
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h4 className="text-[10.5px] font-bold leading-tight">
                    {exp.role}
                  </h4>
                  <span className="shrink-0 text-[8.5px] font-semibold opacity-60">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>
                <div className="mb-1.5 text-[9px] font-semibold opacity-70">
                  {exp.company}{exp.location ? `, ${exp.location}` : ""}
                </div>
                {exp.description && <Description text={exp.description} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION ── */}
      {data.education.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-2.5 border-b border-current pb-1 text-[8.5px] font-bold uppercase tracking-[1.5px]">
            Education
          </h3>
          <div className="flex flex-col">
            {data.education.map((edu, i) => (
              <div
                key={edu.id}
                className={
                  i < data.education.length - 1
                    ? "mb-3 border-b border-gray-100 pb-3"
                    : ""
                }
              >
                <div className="mb-1 flex items-baseline justify-between gap-4">
                  <h4 className="text-[10.5px] font-bold leading-tight">
                    {edu.degree}
                    {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                  </h4>
                  <span className="shrink-0 text-[8.5px] font-semibold opacity-60">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </span>
                </div>
                <div className="mb-1.5 text-[9px] font-semibold opacity-70">
                  {edu.institution}
                </div>
                {edu.description && <Description text={edu.description} />}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SKILLS ── */}
      {data.skills.length > 0 && (
        <section>
          <h3 className="mb-2.5 border-b border-current pb-1 text-[8.5px] font-bold uppercase tracking-[1.5px]">
            Core Competencies
          </h3>
          <div className="flex flex-wrap gap-x-0 gap-y-1">
            {data.skills.map((skill, i) => (
              <span
                key={skill.id}
                className="flex w-1/3 items-center gap-1.5 text-[9.5px] font-medium opacity-90"
              >
                <span className="h-[3px] w-[3px] shrink-0 rounded-full bg-current opacity-40" />
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};