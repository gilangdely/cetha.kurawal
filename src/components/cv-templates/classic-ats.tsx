import { ResumeData } from "../../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

export const ClassicAts = ({
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
        fontFamily: style.fontFamily,
        color: style.fontColor,
      }}
    >
      {/* Header */}
      <div className="mb-4 flex flex-col items-center border-b-2 border-current pb-4 text-center">
        {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
          <img
            src={data.personalInfo.photoUrl}
            alt="Profile Photo"
            className="mb-3 h-24 w-24 rounded-full border border-gray-300 object-cover"
          />
        )}

        <h1 className="mb-1 text-3xl font-bold tracking-wider uppercase">
          {data.personalInfo.fullName || "Nama Lengkap"}
        </h1>

        {data.personalInfo.jobTitle && (
          <h2 className="mb-2 text-xl font-medium opacity-90">
            {data.personalInfo.jobTitle}
          </h2>
        )}

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm opacity-80">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
          {data.personalInfo.location && (
            <span>• {data.personalInfo.location}</span>
          )}
          {data.personalInfo.linkedin && (
            <span>• {data.personalInfo.linkedin}</span>
          )}
          {data.personalInfo.portfolio && (
            <span>• {data.personalInfo.portfolio}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="mb-2 border-b border-current pb-1 text-lg font-bold uppercase">
            Professional Summary
          </h3>

          <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 border-b border-current pb-1 text-lg font-bold uppercase">
            Professional Experience
          </h3>

          <div className="flex flex-col gap-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold">{exp.role}</h4>

                    <div className="font-semibold opacity-90">
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                    </div>
                  </div>

                  <div className="ml-4 text-sm font-medium whitespace-nowrap opacity-80">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </div>
                </div>

                {exp.description && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-3 border-b border-current pb-1 text-lg font-bold uppercase">
            Education
          </h3>

          <div className="flex flex-col gap-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold">
                      {edu.degree}
                      {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
                    </h4>

                    <div className="font-semibold opacity-90">
                      {edu.institution}
                    </div>
                  </div>

                  <div className="ml-4 text-sm font-medium whitespace-nowrap opacity-80">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </div>
                </div>

                {edu.description && (
                  <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap opacity-90">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 border-b border-current pb-1 text-lg font-bold uppercase">
            Skills
          </h3>

          <ul className="list-inside list-disc columns-2 gap-4 text-sm lg:columns-3 opacity-90">
            {data.skills.map((skill) => (
              <li key={skill.id} className="leading-relaxed">
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
