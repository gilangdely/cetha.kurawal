import { ResumeData } from "../../types/build-cv";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const CompactProfessionalTemplate = ({
  data,
  style,
}: {
  data: ResumeData;
  style: CvStyle;
}) => {
  return (
    <div
      className="cv-document mx-auto min-h-[297mm] w-[210mm] bg-white p-8 shadow-sm print:shadow-none"
      style={{
        fontFamily: style.fontFamily || "'Manrope', sans-serif",
        color: style.fontColor,
      }}
    >
      {/* ── HEADER & CONTACT (Compact Row) ── */}
      <header className="mb-5 flex items-center justify-between border-b-2 border-gray-800 pb-4">
        <div className="flex items-center gap-5">
          {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
            <img
              src={data.personalInfo.photoUrl}
              alt="Profile"
              className="h-16 w-16 shrink-0 rounded-md object-cover border border-gray-300 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-gray-900" style={{ fontFamily: "'Manrope', sans-serif" }}>
              {data.personalInfo.fullName || "Nama Lengkap"}
            </h1>
            {data.personalInfo.jobTitle && (
              <h2 className="mt-0.5 text-lg font-bold text-gray-700">
                {data.personalInfo.jobTitle}
              </h2>
            )}
          </div>
        </div>

        {/* Contact info grid right aligned */}
        <div className="text-right text-[11px] font-medium text-gray-600">
          <ul className="flex flex-col gap-1 items-end">
            {data.personalInfo.email && (
              <li className="flex items-center gap-1.5 justify-end">
                <span>{data.personalInfo.email}</span>
                <Mail size={12} className="text-gray-400" />
              </li>
            )}
            {data.personalInfo.phone && (
              <li className="flex items-center gap-1.5 justify-end">
                <span>{data.personalInfo.phone}</span>
                <Phone size={12} className="text-gray-400" />
              </li>
            )}
            {data.personalInfo.location && (
              <li className="flex items-center gap-1.5 justify-end">
                <span>{data.personalInfo.location}</span>
                <MapPin size={12} className="text-gray-400" />
              </li>
            )}
            {data.personalInfo.linkedin && (
              <li className="flex items-center gap-1.5 justify-end">
                <span>{data.personalInfo.linkedin}</span>
                <Linkedin size={12} className="text-gray-400" />
              </li>
            )}
            {data.personalInfo.portfolio && (
              <li className="flex items-center gap-1.5 justify-end">
                <span>{data.personalInfo.portfolio}</span>
                <Globe size={12} className="text-gray-400" />
              </li>
            )}
          </ul>
        </div>
      </header>

      {/* ── PROFILE SUMMARY ── */}
      {data.personalInfo.summary && (
        <section className="mb-4">
          <p className="text-[12px] leading-snug text-gray-800 whitespace-pre-wrap text-justify">
            <strong className="uppercase text-[11px] tracking-wider text-gray-500 mr-2">Ringkasan:</strong>
            {data.personalInfo.summary}
          </p>
        </section>
      )}

      {/* ── WORK EXPERIENCE ── */}
      {data.experience.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-2 border-b border-gray-300 pb-1 text-[13px] font-extrabold uppercase tracking-widest text-gray-800">
            Pengalaman Kerja
          </h3>
          <div className="space-y-3">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <h4 className="text-[14px] font-bold text-gray-900">
                    {exp.role} <span className="font-normal mx-1">di</span> <span className="font-semibold">{exp.company}</span>
                    {exp.location && <span className="text-gray-500 font-normal">, {exp.location}</span>}
                  </h4>
                  <span className="shrink-0 text-[11px] font-bold text-gray-600">
                    {exp.startDate} – {exp.endDate || "Sekarang"}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-[12px] leading-snug text-gray-700 whitespace-pre-wrap text-justify">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── EDUCATION & SKILLS IN 2 COLUMNS ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* Education (7 cols) */}
        {data.education.length > 0 && (
          <section className="col-span-7">
            <h3 className="mb-2 border-b border-gray-300 pb-1 text-[13px] font-extrabold uppercase tracking-widest text-gray-800">
              Pendidikan
            </h3>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[13px] font-bold text-gray-900">
                      {edu.degree} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}
                    </h4>
                    <span className="shrink-0 text-[11px] font-bold text-gray-600">
                      {edu.startDate} – {edu.endDate || "Sekarang"}
                    </span>
                  </div>
                  <div className="text-[12px] font-medium text-gray-700">
                    {edu.institution}
                  </div>
                  {edu.description && (
                    <p className="mt-0.5 text-[11px] leading-snug text-gray-500 whitespace-pre-wrap">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills (5 cols) */}
        {data.skills.length > 0 && (
          <section className="col-span-5">
            <h3 className="mb-2 border-b border-gray-300 pb-1 text-[13px] font-extrabold uppercase tracking-widest text-gray-800">
              Keahlian
            </h3>
            <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
              {data.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-800 border border-gray-200"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
