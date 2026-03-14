import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const ModernAts = ({
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
      <header className="mb-8 flex items-start gap-6">
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile Photo"
            className="border-primaryBlue/20 h-24 w-24 shrink-0 rounded-2xl border object-cover shadow-sm"
          />
        )}

        <div className="flex-1">
          <h1 className="text-primaryBlue mb-2 text-4xl font-extrabold tracking-tight">
            {data.personalInfo.fullName || "Nama Lengkap"}
          </h1>

          {data.personalInfo.jobTitle && (
            <h2 className="mb-3 text-2xl font-semibold opacity-90">
              {data.personalInfo.jobTitle}
            </h2>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium opacity-70">
            {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
            {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
            {data.personalInfo.location && (
              <span>{data.personalInfo.location}</span>
            )}
            {data.personalInfo.linkedin && (
              <span>{data.personalInfo.linkedin}</span>
            )}
            {data.personalInfo.portfolio && (
              <span>{data.personalInfo.portfolio}</span>
            )}
          </div>
        </div>
      </header>

      {/* Profile */}
      {data.personalInfo.summary && (
        <section className="mb-6">
          <h3 className="text-primaryBlue mb-2 text-lg font-bold tracking-wider uppercase">
            Profile
          </h3>

          <div className="mb-3 h-px w-full bg-gray-200" />

          <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-primaryBlue mb-2 text-lg font-bold tracking-wider uppercase">
            Experience
          </h3>

          <div className="mb-4 h-px w-full bg-gray-200" />

          <div className="flex flex-col gap-5">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <h4 className="text-base font-bold opacity-100">
                    {exp.role}
                  </h4>

                  <span className="text-primaryBlue ml-4 rounded bg-blue-50 px-2 py-0.5 text-sm font-semibold whitespace-nowrap">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                </div>

                <div className="mb-2 font-medium opacity-80">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </div>

                {exp.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
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
        <section className="mb-6">
          <h3 className="text-primaryBlue mb-2 text-lg font-bold tracking-wider uppercase">
            Education
          </h3>

          <div className="mb-4 h-px w-full bg-gray-200" />

          <div className="flex flex-col gap-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-1 flex items-baseline justify-between">
                  <h4 className="text-base font-bold opacity-100">
                    {edu.degree}
                    {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                  </h4>

                  <span className="text-primaryBlue ml-4 rounded bg-blue-50 px-2 py-0.5 text-sm font-semibold whitespace-nowrap">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </span>
                </div>

                <div className="font-medium opacity-80">
                  {edu.institution}
                </div>

                {edu.description && (
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap opacity-90">
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
        <section className="mb-6">
          <h3 className="text-primaryBlue mb-2 text-lg font-bold tracking-wider uppercase">
            Skills
          </h3>

          <div className="mb-3 h-px w-full bg-gray-200" />

          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-md bg-gray-100 px-3 py-1 text-sm font-medium opacity-100"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
