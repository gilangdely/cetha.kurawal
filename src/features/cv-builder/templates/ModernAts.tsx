import { ResumeData } from "../types";

export const ModernAts = ({ data }: { data: ResumeData }) => {
    return (
        <div className="print-cv bg-white p-8 font-sans text-gray-900 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-primaryBlue mb-2 tracking-tight">
                    {data.personalInfo.fullName || "Nama Lengkap"}
                </h1>
                {data.personalInfo.jobTitle && (
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                        {data.personalInfo.jobTitle}
                    </h2>
                )}
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 font-medium">
                    {data.personalInfo.email && <span className="flex items-center gap-1">{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span className="flex items-center gap-1">{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span className="flex items-center gap-1">{data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && <span className="flex items-center gap-1">{data.personalInfo.linkedin}</span>}
                    {data.personalInfo.portfolio && <span className="flex items-center gap-1">{data.personalInfo.portfolio}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.personalInfo.summary && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-primaryBlue uppercase tracking-wider mb-2">Profile</h3>
                    <div className="w-full h-px bg-gray-200 mb-3" />
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-primaryBlue uppercase tracking-wider mb-2">Experience</h3>
                    <div className="w-full h-px bg-gray-200 mb-4" />
                    <div className="flex flex-col gap-5">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900 text-base">{exp.role}</h4>
                                    <span className="text-sm font-semibold text-primaryBlue bg-blue-50 px-2 py-0.5 rounded ml-4 whitespace-nowrap">
                                        {exp.startDate} - {exp.endDate || "Present"}
                                    </span>
                                </div>
                                <div className="font-medium text-gray-600 mb-2">{exp.company}{exp.location && ` • ${exp.location}`}</div>
                                {exp.description && (
                                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-primaryBlue uppercase tracking-wider mb-2">Education</h3>
                    <div className="w-full h-px bg-gray-200 mb-4" />
                    <div className="flex flex-col gap-4">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-bold text-gray-900 text-base">{edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</h4>
                                    <span className="text-sm font-semibold text-primaryBlue bg-blue-50 px-2 py-0.5 rounded ml-4 whitespace-nowrap">
                                        {edu.startDate} - {edu.endDate || "Present"}
                                    </span>
                                </div>
                                <div className="font-medium text-gray-600">{edu.institution}</div>
                                {edu.description && (
                                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap mt-1">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-lg font-bold text-primaryBlue uppercase tracking-wider mb-2">Skills</h3>
                    <div className="w-full h-px bg-gray-200 mb-3" />
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span key={skill.id} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md font-medium">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
