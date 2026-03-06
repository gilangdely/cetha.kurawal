import { ResumeData } from "../types";

export const MinimalAts = ({ data }: { data: ResumeData }) => {
    return (
        <div className="print-cv bg-white p-10 font-sans text-gray-800 max-w-[210mm] mx-auto min-h-[297mm] shadow-sm">
            {/* Header */}
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-300 pb-6">
                <div className="flex items-end gap-5">
                    {data.personalInfo.showPhoto && data.personalInfo.photoUrl && (
                        <img
                            src={data.personalInfo.photoUrl}
                            alt="Profile Photo"
                            className="w-20 h-20 rounded-md object-cover border border-gray-200 block"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-light tracking-tight text-black mb-1">
                            {data.personalInfo.fullName || "Nama Lengkap"}
                        </h1>
                        {data.personalInfo.jobTitle && (
                            <h2 className="text-lg font-normal text-gray-500 uppercase tracking-widest">
                                {data.personalInfo.jobTitle}
                            </h2>
                        )}
                    </div>
                </div>
                <div className="flex flex-col text-sm text-gray-500 items-start md:items-end text-right space-y-0.5">
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            {/* Summary */}
            {data.personalInfo.summary && (
                <section className="mb-8 flex flex-col md:flex-row gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 w-32 shrink-0 pt-1">Profile</h3>
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-8 flex flex-col md:flex-row gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 w-32 shrink-0 pt-1">Experience</h3>
                    <div className="flex flex-col gap-6 w-full">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-semibold text-black text-base">{exp.role}</h4>
                                    <span className="text-xs font-medium text-gray-400 tracking-wider ml-4 whitespace-nowrap">
                                        {exp.startDate} — {exp.endDate || "PRESENT"}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-gray-600 mb-2">{exp.company}{exp.location && ` • ${exp.location}`}</div>
                                {exp.description && (
                                    <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-8 flex flex-col md:flex-row gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 w-32 shrink-0 pt-1">Education</h3>
                    <div className="flex flex-col gap-5 w-full">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="font-semibold text-black text-base">{edu.degree}{edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}</h4>
                                    <span className="text-xs font-medium text-gray-400 tracking-wider ml-4 whitespace-nowrap">
                                        {edu.startDate} — {edu.endDate || "PRESENT"}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{edu.institution}</div>
                                {edu.description && (
                                    <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap mt-1">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="flex flex-col md:flex-row gap-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 w-32 shrink-0 pt-1">Skills</h3>
                    <p className="text-sm leading-relaxed text-gray-700">
                        {data.skills.map((s) => s.name).join(" • ")}
                    </p>
                </section>
            )}
        </div>
    );
};
