import { ResumeData } from "../types";

export const ClassicAts = ({ data }: { data: ResumeData }) => {
    return (
        <div className="print-cv bg-white p-8 font-sans text-black max-w-[210mm] mx-auto min-h-[297mm] shadow-sm">
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-4 flex flex-col items-center">
                {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
                    <img
                        src={data.personalInfo.photoUrl}
                        alt="Profile Photo"
                        className="w-24 h-24 rounded-full object-cover mb-3 border border-gray-300"
                    />
                )}
                <h1 className="text-3xl font-bold uppercase tracking-wider mb-1">
                    {data.personalInfo.fullName || "Nama Lengkap"}
                </h1>
                {data.personalInfo.jobTitle && (
                    <h2 className="text-xl font-medium text-gray-800 mb-2">
                        {data.personalInfo.jobTitle}
                    </h2>
                )}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>• {data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>• {data.personalInfo.location}</span>}
                    {data.personalInfo.linkedin && <span>• {data.personalInfo.linkedin}</span>}
                    {data.personalInfo.portfolio && <span>• {data.personalInfo.portfolio}</span>}
                </div>
            </div>

            {/* Summary */}
            {data.personalInfo.summary && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Professional Summary</h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{data.personalInfo.summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold uppercase border-b border-black mb-3 pb-1">Professional Experience</h3>
                    <div className="flex flex-col gap-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-base">{exp.role}</h4>
                                        <div className="font-semibold text-gray-800">{exp.company}{exp.location && `, ${exp.location}`}</div>
                                    </div>
                                    <div className="text-sm font-medium whitespace-nowrap ml-4">
                                        {exp.startDate} - {exp.endDate || "Present"}
                                    </div>
                                </div>
                                {exp.description && (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold uppercase border-b border-black mb-3 pb-1">Education</h3>
                    <div className="flex flex-col gap-4">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h4 className="font-bold text-base">{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h4>
                                        <div className="font-semibold text-gray-800">{edu.institution}</div>
                                    </div>
                                    <div className="text-sm font-medium whitespace-nowrap ml-4">
                                        {edu.startDate} - {edu.endDate || "Present"}
                                    </div>
                                </div>
                                {edu.description && (
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap mt-1">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-lg font-bold uppercase border-b border-black mb-2 pb-1">Skills</h3>
                    <ul className="list-disc list-inside text-sm columns-2 lg:columns-3 gap-4">
                        {data.skills.map((skill) => (
                            <li key={skill.id} className="leading-relaxed">{skill.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
