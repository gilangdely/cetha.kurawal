import { useCvBuilderStore } from "../store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReorderList } from "./ReorderList";
import { Plus } from "lucide-react";

export const CvForm = () => {
    const { data, updatePersonalInfo, addExperience, updateExperience, removeExperience, reorderExperience, addEducation, updateEducation, removeEducation, reorderEducation, addSkill, updateSkill, removeSkill, reorderSkills } = useCvBuilderStore();

    const handleAddExperience = () => {
        addExperience({
            id: crypto.randomUUID(),
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            location: "",
            description: "",
        });
    };

    const handleAddEducation = () => {
        addEducation({
            id: crypto.randomUUID(),
            institution: "",
            degree: "",
            fieldOfStudy: "",
            startDate: "",
            endDate: "",
            description: "",
        });
    };

    const handleAddSkill = () => {
        addSkill({
            id: crypto.randomUUID(),
            name: "",
        });
    };

    return (
        <div className="flex flex-col gap-8 p-1">
            {/* Personal Info */}
            <section className="space-y-4">
                <h2 className="text-xl font-bold bg-gray-50 p-3 rounded-md border-b">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                    <div className="space-y-1.5">
                        <Label>Nama Lengkap</Label>
                        <Input value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo("fullName", e.target.value)} placeholder="Misal: Budi Santoso" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Job Title / Posisi</Label>
                        <Input value={data.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)} placeholder="Misal: Software Engineer" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Email</Label>
                        <Input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo("email", e.target.value)} placeholder="misal: budi@email.com" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>No Telepon</Label>
                        <Input value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo("phone", e.target.value)} placeholder="+62 812..." />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Lokasi / Domisili</Label>
                        <Input value={data.personalInfo.location} onChange={(e) => updatePersonalInfo("location", e.target.value)} placeholder="Jakarta, Indonesia" />
                    </div>
                    <div className="space-y-1.5">
                        <Label>LinkedIn</Label>
                        <Input value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo("linkedin", e.target.value)} placeholder="linkedin.com/in/budi" />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                        <Label>Professional Summary</Label>
                        <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={data.personalInfo.summary}
                            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                            placeholder="Ceritakan singkat tentang pengalaman dan keahlian utamamu..."
                        />
                    </div>
                </div>
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border-b">
                    <h2 className="text-xl font-bold">Experience</h2>
                    <Button variant="outline" size="sm" onClick={handleAddExperience}><Plus size={16} className="mr-1" /> Tambah</Button>
                </div>
                <div className="px-2">
                    <ReorderList
                        items={data.experience}
                        onReorder={reorderExperience}
                        onRemove={removeExperience}
                        renderItemContent={(exp) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Posisi / Jabatan</Label>
                                    <Input value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} placeholder="Frontend Developer" className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Nama Perusahaan</Label>
                                    <Input value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} placeholder="PT Maju Bersama" className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Kapan Mulai?</Label>
                                    <Input value={exp.startDate} onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)} placeholder="Jan 2021" className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Kapan Selesai?</Label>
                                    <Input value={exp.endDate} onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)} placeholder="Present / Des 2023" className="h-8 text-sm" />
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-1.5 mt-1">
                                    <Label className="text-xs text-gray-500">Deskripsi & Pencapaian</Label>
                                    <textarea
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={exp.description}
                                        onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                                        placeholder="• Membangun fitur X&#10;• Meningkatkan performa Y sebesar 20%"
                                    />
                                </div>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border-b">
                    <h2 className="text-xl font-bold">Education</h2>
                    <Button variant="outline" size="sm" onClick={handleAddEducation}><Plus size={16} className="mr-1" /> Tambah</Button>
                </div>
                <div className="px-2">
                    <ReorderList
                        items={data.education}
                        onReorder={reorderEducation}
                        onRemove={removeEducation}
                        renderItemContent={(edu) => (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Institusi / Universitas</Label>
                                    <Input value={edu.institution} onChange={(e) => updateEducation(edu.id, "institution", e.target.value)} placeholder="Universitas Indonesia" className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Gelar</Label>
                                    <Input value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} placeholder="Sarjana Komputer" className="h-8 text-sm" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-gray-500">Jurusan</Label>
                                    <Input value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)} placeholder="Ilmu Komputer" className="h-8 text-sm" />
                                </div>
                                <div className="col-span-1 md:col-span-1 flex gap-2">
                                    <div className="space-y-1.5 flex-1">
                                        <Label className="text-xs text-gray-500">Mulai</Label>
                                        <Input value={edu.startDate} onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)} placeholder="2018" className="h-8 text-sm" />
                                    </div>
                                    <div className="space-y-1.5 flex-1">
                                        <Label className="text-xs text-gray-500">Selesai</Label>
                                        <Input value={edu.endDate} onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)} placeholder="2022" className="h-8 text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md border-b">
                    <h2 className="text-xl font-bold">Skills</h2>
                    <Button variant="outline" size="sm" onClick={handleAddSkill}><Plus size={16} className="mr-1" /> Tambah</Button>
                </div>
                <div className="px-2">
                    <ReorderList
                        items={data.skills}
                        onReorder={reorderSkills}
                        onRemove={removeSkill}
                        renderItemContent={(skill) => (
                            <div className="space-y-1.5">
                                <Input value={skill.name} onChange={(e) => updateSkill(skill.id, e.target.value)} placeholder="ReactJS, TypeScript, Project Management..." className="h-8 text-sm" />
                            </div>
                        )}
                    />
                </div>
            </section>

        </div>
    );
};
