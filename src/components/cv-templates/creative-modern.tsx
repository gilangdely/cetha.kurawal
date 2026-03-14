import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const CreativeModernTemplate = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  return (
    <div
      className="cv-document mx-auto flex min-h-[297mm] w-[210mm] bg-white shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily,
        color: style.fontColor,
      }}
    >
      {/* ── LEFT SIDEBAR (30%) ── */}
      <aside className="w-[30%] shrink-0 bg-primaryBlue/5 p-6 border-r border-primaryBlue/10">
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <div className="mb-6 flex justify-center">
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-md"
            />
          </div>
        )}

        {/* Contact Info */}
        <div className="mb-8 space-y-4 text-sm">
          <h3 className="text-primaryBlue border-b-2 border-primaryBlue/20 pb-1 text-sm font-bold uppercase tracking-widest">
            Kontak
          </h3>
          <ul className="space-y-3 font-medium opacity-80">
            {data.personalInfo.email && <li className="break-all">{data.personalInfo.email}</li>}
            {data.personalInfo.phone && <li>{data.personalInfo.phone}</li>}
            {data.personalInfo.location && <li>{data.personalInfo.location}</li>}
            {data.personalInfo.linkedin && (
              <li className="break-all">{data.personalInfo.linkedin}</li>
            )}
            {data.personalInfo.portfolio && (
              <li className="break-all">{data.personalInfo.portfolio}</li>
            )}
          </ul>
        </div>

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-primaryBlue border-b-2 border-primaryBlue/20 pb-1 text-sm font-bold uppercase tracking-widest">
              Keahlian
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-primaryBlue shadow-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ── MAIN BODY (70%) ── */}
      <main className="w-[70%] p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 
            className="mb-1 text-4xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Manrope', sans-serif" }} // Wording instruction: Use Manrope bold
          >
            {data.personalInfo.fullName || "Nama Lengkap"}
          </h1>
          {data.personalInfo.jobTitle && (
            <h2 className="text-primaryBlue text-xl font-bold uppercase tracking-wide opacity-90">
              {data.personalInfo.jobTitle}
            </h2>
          )}
        </header>

        {/* Profile */}
        {data.personalInfo.summary && (
          <section className="mb-8">
            <h3 className="text-primaryBlue mb-3 flex items-center text-lg font-bold uppercase tracking-wider before:mr-3 before:h-1.5 before:w-6 before:bg-primaryBlue before:content-['']">
              Profil
            </h3>
            <p className="text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h3 className="text-primaryBlue mb-5 flex items-center text-lg font-bold uppercase tracking-wider before:mr-3 before:h-1.5 before:w-6 before:bg-primaryBlue before:content-['']">
              Pengalaman
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-primaryBlue/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[16px] font-bold leading-tight">{exp.role}</h4>
                      <div className="text-[14px] font-semibold opacity-80 mt-1">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </div>
                    </div>
                    <span className="shrink-0 text-right text-[13px] font-medium opacity-70">
                      {exp.startDate} - {exp.endDate || "Sekarang"}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap">
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
          <section>
            <h3 className="text-primaryBlue mb-5 flex items-center text-lg font-bold uppercase tracking-wider before:mr-3 before:h-1.5 before:w-6 before:bg-primaryBlue before:content-['']">
              Pendidikan
            </h3>
            <div className="space-y-5">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative pl-4 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-primaryBlue/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-[16px] font-bold leading-tight">
                        {edu.degree}
                        {edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                      </h4>
                      <div className="text-[14px] font-semibold opacity-80 mt-1">
                        {edu.institution}
                      </div>
                    </div>
                    <span className="shrink-0 text-right text-[13px] font-medium opacity-70">
                      {edu.startDate} - {edu.endDate || "Sekarang"}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-[14px] leading-relaxed opacity-90 whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
