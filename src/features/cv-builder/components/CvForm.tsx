import { useCvBuilderStore } from "../store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ReorderList } from "./ReorderList";
import { ImageCropDialog } from "./ImageCropDialog";
import { Plus, ImagePlus, X, Loader2, Sparkles, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpgradeModal } from "@/components/UpgradeModal";

export const CvForm = () => {
    const {
        data, updatePersonalInfo, setPhoto, togglePhoto,
        addExperience, updateExperience, removeExperience, reorderExperience,
        addEducation, updateEducation, removeEducation, reorderEducation,
        addSkill, updateSkill, removeSkill, reorderSkills
    } = useCvBuilderStore();

    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [cropImageSrc, setCropImageSrc] = useState("");
    const [showCropModal, setShowCropModal] = useState(false);

    // AI States
    const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [upgradeMessage, setUpgradeMessage] = useState("");

    const handleAIGenerate = async (
        type: "summary" | "experience" | "education",
        id: "summary" | string,
        currentText: string,
        onSuccess: (result: string) => void
    ) => {
        if (!currentText.trim()) {
            toast.error("Isi poin inti terlebih dahulu agar AI bisa bekerja.");
            return;
        }

        try {
            setGeneratingIds((prev) => ({ ...prev, [id]: true }));
            const res = await fetch("/api/generate-cv", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, context: currentText }),
            });

            const responseData = await res.json();

            if (!res.ok || !responseData?.success) {
                if (responseData?.requireUpgrade) {
                    setUpgradeMessage(responseData.message || "Kuota kamu habis.");
                    setShowUpgradeModal(true);
                    return;
                }
                throw new Error(responseData?.error || responseData?.message || "Gagal generate text menggunakan AI.");
            }

            onSuccess(responseData.result);
            toast.success("Teks berhasil diperbarui dengan AI!");
        } catch (e: any) {
            console.error(e);
            toast.error(e.message || "Terjadi kesalahan koneksi saat memanggil AI.");
        } finally {
            setGeneratingIds((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handlePhotoSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset input immediately
        event.target.value = '';

        if (!file.type.startsWith("image/")) {
            toast.error("Format file tidak didukung. Harap upload gambar (JPG/PNG/WEBP).");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran file melebihi batas maksimum 2 MB.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setCropImageSrc(imageUrl);
        setShowCropModal(true);
    };

    const handlePhotoUpload = async (blob: Blob) => {
        try {
            setShowCropModal(false);
            setCropImageSrc(""); // Release memory
            setIsUploadingPhoto(true);
            toast.info("Mengunggah foto...");

            const formData = new FormData();
            formData.append("file", blob, "profile.jpg");
            formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
            formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!);

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Gagal mengunggah foto");

            const result = await res.json();
            setPhoto(result.secure_url);
            toast.success("Foto berhasil diunggah!");
        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan saat mengunggah foto.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

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
                <div className="bg-gray-50 p-3 rounded-md border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">Personal Information</h2>
                </div>

                {/* Photo Upload Section */}
                <div className="px-2 flex gap-4 md:gap-6 items-start flex-col sm:flex-row">
                    <div className="shrink-0 flex flex-col gap-2 w-full sm:w-auto items-center sm:items-start">
                        <Label className="self-center sm:self-auto">Foto Profil</Label>
                        <div className="relative group w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden">
                            {isUploadingPhoto ? (
                                <Loader2 className="animate-spin text-gray-400" />
                            ) : data.personalInfo.photoUrl ? (
                                <>
                                    <img src={data.personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => setPhoto("")}
                                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                                            title="Hapus Foto"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-primaryBlue hover:bg-blue-50 transition">
                                    <ImagePlus size={24} />
                                    <span className="text-[10px] mt-1 font-medium">Upload</span>
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handlePhotoSelected} />
                                </label>
                            )}
                        </div>
                        <span className="text-[10px] text-gray-500 max-w-[96px] text-center sm:text-left leading-tight">
                            Format: JPG/PNG/WEBP<br /> Maks: 2 MB
                        </span>
                        {data.personalInfo.photoUrl && (
                            <label className="flex items-center gap-2 mt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded text-primaryBlue focus:ring-primaryBlue accent-primaryBlue"
                                    checked={data.personalInfo.showPhoto}
                                    onChange={(e) => togglePhoto(e.target.checked)}
                                />
                                <span className="text-xs text-gray-600 font-medium">Tampilkan Foto</span>
                            </label>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 w-full">
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
                            <div className="flex justify-between items-center mb-1 drop-shadow-sm">
                                <Label>Professional Summary</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs flex items-center gap-1.5"
                                    onClick={() => handleAIGenerate(
                                        "summary",
                                        "summary",
                                        data.personalInfo.summary,
                                        (res) => updatePersonalInfo("summary", res)
                                    )}
                                    disabled={generatingIds["summary"] || !data.personalInfo.summary}
                                >
                                    {generatingIds["summary"] ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-primaryBlue" />}
                                    Improve with AI
                                </Button>
                            </div>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={data.personalInfo.summary}
                                onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                                placeholder="Ceritakan singkat tentang pengalaman dan keahlian utamamu..."
                            />
                        </div>
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
                                    <div className="flex justify-between items-center mb-1">
                                        <Label className="text-xs text-gray-500">Deskripsi & Pencapaian</Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] flex items-center gap-1"
                                            onClick={() => handleAIGenerate(
                                                "experience",
                                                exp.id,
                                                exp.description,
                                                (res) => updateExperience(exp.id, "description", res)
                                            )}
                                            disabled={generatingIds[exp.id] || !exp.description}
                                        >
                                            {generatingIds[exp.id] ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-primaryBlue" />}
                                            Bantu susun bullet points (AI)
                                        </Button>
                                    </div>
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
                                <div className="col-span-1 md:col-span-2 space-y-1.5 pt-2 mt-1 border-t">
                                    <div className="flex justify-between items-center bg-transparent mb-1">
                                        <Label className="text-xs text-gray-500">Aktivitas / Pencapaian Edukasi (Opsional)</Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-6 px-2 text-[10px] flex items-center gap-1"
                                            onClick={() => handleAIGenerate(
                                                "education",
                                                edu.id,
                                                edu.description || "",
                                                (res) => updateEducation(edu.id, "description", res)
                                            )}
                                            disabled={generatingIds[edu.id] || !edu.description}
                                        >
                                            {generatingIds[edu.id] ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-primaryBlue" />}
                                            Rapikan teks (AI)
                                        </Button>
                                    </div>
                                    <textarea
                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                        value={edu.description || ""}
                                        onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                                        placeholder="Contoh: Lulusan terbaik, aktif di organisasi himpunan mahasiswa..."
                                    />
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

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                message={upgradeMessage}
            />

            <ImageCropDialog
                isOpen={showCropModal}
                onClose={() => {
                    setShowCropModal(false);
                    setCropImageSrc("");
                }}
                imageSrc={cropImageSrc}
                onConfirm={(blob) => handlePhotoUpload(blob)}
            />

        </div>
    );
};
