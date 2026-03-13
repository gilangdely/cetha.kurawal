import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const MinimalAts = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  return (
    <div
      className="cv-document mx-auto min-h-[297mm] w-[210mm] bg-white p-10 shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily,
        color: style.fontColor,
      }}
    >
      {/* Header */}
      <header className="mb-8 flex flex-row items-end justify-between gap-4 border-b border-gray-300 pb-6">
        <div className="flex items-end gap-5">
          {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile Photo"
              className="block h-20 w-20 rounded-md border border-gray-200 object-cover"
            />
          )}
          <div>
            <h1 className="mb-1 text-3xl font-light tracking-tight opacity-100">
              {data.personalInfo.fullName || "Nama Lengkap"}
            </h1>
            {data.personalInfo.jobTitle && (
              <h2 className="text-lg font-normal tracking-widest opacity-60 uppercase">
                {data.personalInfo.jobTitle}
              </h2>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end space-y-0.5 text-right text-sm opacity-60">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.linkedin && (
            <span>{data.personalInfo.linkedin}</span>
          )}
          {data.personalInfo.location && (
            <span>{data.personalInfo.location}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.personalInfo.summary && (
        <section className="mb-8 flex flex-row gap-4">
          <h3 className="w-32 shrink-0 pt-1 text-xs font-bold tracking-widest opacity-50 uppercase">
            Profile
          </h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8 flex flex-row gap-4">
          <h3 className="w-32 shrink-0 pt-1 text-xs font-bold tracking-widest opacity-50 uppercase">
            Experience
          </h3>
          <div className="flex w-full flex-col gap-6">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <h4 className="text-base font-semibold opacity-100">
                    {exp.role}
                  </h4>
                  <span className="ml-4 text-xs font-medium tracking-wider whitespace-nowrap opacity-50">
                    {exp.startDate} — {exp.endDate || "PRESENT"}
                  </span>
                </div>
                <div className="mb-2 text-sm font-medium opacity-80">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </div>
                {exp.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-80">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <section className="mb-8 flex flex-row gap-4">
          <h3 className="w-32 shrink-0 pt-1 text-xs font-bold tracking-widest opacity-50 uppercase">
            Education
          </h3>
          <div className="flex w-full flex-col gap-5">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <h4 className="text-base font-semibold opacity-100">
                    {edu.degree}
                    {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                  </h4>
                  <span className="ml-4 text-xs font-medium tracking-wider whitespace-nowrap opacity-50">
                    {edu.startDate} — {edu.endDate || "PRESENT"}
                  </span>
                </div>
                <div className="text-sm opacity-80">{edu.institution}</div>
                {edu.description && (
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap opacity-80">
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
        <section className="flex flex-row gap-4">
          <h3 className="w-32 shrink-0 pt-1 text-xs font-bold tracking-widest opacity-50 uppercase">
            Skills
          </h3>
          <p className="text-sm leading-relaxed opacity-90">
            {data.skills.map((s) => s.name).join(" • ")}
          </p>
        </section>
      )}
    </div>
  );
};
