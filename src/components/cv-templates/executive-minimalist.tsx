import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const ExecutiveMinimalistTemplate = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  return (
    <div
      className="cv-document mx-auto min-h-[297mm] w-[210mm] bg-white px-12 py-12 shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily || "'Manrope', sans-serif",
        color: style.fontColor,
      }}
    >
      {/* Header */}
      <header className="mb-10 text-center">
        {/* Fitur Auto-Layout jika toggle showPhoto nyala atau mati */}
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile"
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover shadow-sm grayscale hover:grayscale-0 transition-all duration-300"
          />
        )}
        
        <h1 className="text-4xl font-extrabold uppercase tracking-widest text-gray-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
          {data.personalInfo.fullName || "Nama Lengkap"}
        </h1>
        
        {data.personalInfo.jobTitle && (
          <h2 className="mt-2 text-xl font-medium tracking-widest text-[#f59e0b] uppercase">
            {data.personalInfo.jobTitle}
          </h2>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[13px] font-medium tracking-wide text-gray-500">
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.phone && (
            <>
              <span className="text-gray-300">|</span>
              <span>{data.personalInfo.phone}</span>
            </>
          )}
          {data.personalInfo.email && (
            <>
              <span className="text-gray-300">|</span>
              <span>{data.personalInfo.email}</span>
            </>
          )}
          {data.personalInfo.linkedin && (
            <>
              <span className="text-gray-300">|</span>
              <span>{data.personalInfo.linkedin}</span>
            </>
          )}
        </div>
      </header>

      {/* Profile Summary */}
      {data.personalInfo.summary && (
        <section className="mb-8 text-center">
          <p className="mx-auto max-w-3xl text-[14px] leading-loose text-gray-700 whitespace-pre-wrap">
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <section className="mb-8">
          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
              Pengalaman Profesional
            </h3>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    {exp.role}
                  </h4>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {exp.startDate} — {exp.endDate || "Sekarang"}
                  </span>
                </div>
                <div className="mt-1 mb-3 text-[15px] font-semibold text-[#f59e0b]">
                  {exp.company}
                  {exp.location && <span className="text-gray-400 font-normal">, {exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-[14px] leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Skills (2 Columns Layout using internal grid) */}
      <div className="grid grid-cols-2 gap-12">
        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                Pendidikan
              </h3>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="space-y-5">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-[15px] font-bold text-gray-900 leading-tight">
                    {edu.degree}
                    {edu.fieldOfStudy && ` dalam ${edu.fieldOfStudy}`}
                  </h4>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-600">{edu.institution}</span>
                    <span className="text-gray-400 font-medium">
                      {edu.startDate} — {edu.endDate || "Sekarang"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
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
            <div className="mb-6 flex items-center justify-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#f59e0b]">
                Keahlian Inti
              </h3>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <ul className="list-inside list-disc columns-1 space-y-2 text-[14px] font-medium text-gray-700">
              {data.skills.map((skill) => (
                <li key={skill.id}>{skill.name}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
