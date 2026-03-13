import { useCvBuilderStore } from "@/store/buildCvStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReorderList } from "@/components/ReorderList";
import { ImageCropDialog } from "@/components/ImageCropDialog";
import {
  Plus,
  ImagePlus,
  X,
  Loader2,
  Sparkles,
  Briefcase,
  GraduationCap,
  Star,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpgradeModal } from "@/components/UpgradeModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "./ui/textarea";

export default function CvBuildAccordion() {
  const {
    data,
    updatePersonalInfo,
    setPhoto,
    togglePhoto,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperience,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    addSkill,
    updateSkill,
    removeSkill,
    reorderSkills,
  } = useCvBuilderStore();

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState("");
  const [showCropModal, setShowCropModal] = useState(false);

  const [generatingIds, setGeneratingIds] = useState<Record<string, boolean>>({});

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const handleAIGenerate = async (
    type: "summary" | "experience" | "education",
    id: "summary" | string,
    currentText: string,
    onSuccess: (result: string) => void,
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
        throw new Error(
          responseData?.error ||
            responseData?.message ||
            "Gagal generate text menggunakan AI.",
        );
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
    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Format file tidak didukung. Harap upload gambar (JPG/PNG/WEBP).",
      );
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
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

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
    <>
      <Accordion
        type="multiple"
        defaultValue={["personal"]}
        className="overflow-hidden rounded-xl border border-gray-200 bg-white"
      >
        {/* Personal Information */}
        <AccordionItem value="personal" className="border-b last:border-b-0">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2 text-gray-800">
              <User size={16} />
              Personal Information
            </div>
          </AccordionTrigger>

          <AccordionContent className="space-y-4 px-4 pt-2 pb-4">
            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
                {isUploadingPhoto ? (
                  <Loader2 className="animate-spin text-gray-500" />
                ) : data.personalInfo.photoUrl ? (
                  <>
                    <img
                      src={data.personalInfo.photoUrl}
                      className="h-full w-full object-cover"
                    />

                    <button
                      onClick={() => setPhoto("")}
                      className="absolute top-1 right-1 rounded bg-red-500 p-1 text-white shadow"
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center text-gray-400">
                    <ImagePlus size={20} />
                    <span className="text-xs">Upload photo</span>
                    <input
                      type="file"
                      hidden
                      onChange={handlePhotoSelected}
                    />
                  </label>
                )}
              </div>

              <p className="text-center text-xs text-gray-400">Optional</p>
            </div>

            {/* Name */}
            <Input
              placeholder="Full name"
              value={data.personalInfo.fullName}
              className="h-9"
              onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
            />

            {/* Job title */}
            <Input
              placeholder="Job title"
              value={data.personalInfo.jobTitle}
              className="h-9"
              onChange={(e) => updatePersonalInfo("jobTitle", e.target.value)}
            />

            {/* Email */}
            <Input
              placeholder="Email address"
              value={data.personalInfo.email}
              className="h-9"
              onChange={(e) => updatePersonalInfo("email", e.target.value)}
            />

            {/* Summary */}
            <div className="space-y-3">
              <Textarea
                placeholder="Write a short professional summary"
                value={data.personalInfo.summary}
                className="min-h-[110px]"
                onChange={(e) =>
                  updatePersonalInfo("summary", e.target.value)
                }
              />

              <Button
                size="sm"
                className="bg-primaryBlue hover:bg-primaryBlueHover w-full justify-center gap-2 transition-all duration-300"
                onClick={() =>
                  handleAIGenerate(
                    "summary",
                    "summary",
                    data.personalInfo.summary,
                    (res) => updatePersonalInfo("summary", res),
                  )
                }
              >
                {generatingIds["summary"] ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <> </>
                )}
                Enhance Summary
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Experiences */}
        <AccordionItem
          value="experience"
          className="border-b last:border-b-0"
        >
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2 text-gray-800">
              <Briefcase size={16} />
              Work Experience
            </div>
          </AccordionTrigger>

          <AccordionContent className="space-y-4 px-4 pt-2 pb-4">
            <ReorderList
              items={data.experience}
              onReorder={reorderExperience}
              onRemove={removeExperience}
              renderItemContent={(exp) => (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Role */}
                    <Input
                      placeholder="Role"
                      className="h-9"
                      value={exp.role}
                      onChange={(e) =>
                        updateExperience(exp.id, "role", e.target.value)
                      }
                    />

                    {/* Company */}
                    <Input
                      placeholder="Company"
                      className="h-9"
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, "company", e.target.value)
                      }
                    />

                    {/* Start Date */}
                    <Input
                      placeholder="Start date"
                      className="h-9"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "startDate", e.target.value)
                      }
                    />

                    {/* End Date */}
                    <Input
                      placeholder="End date"
                      className="h-9"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, "endDate", e.target.value)
                      }
                    />

                    {/* Description */}
                    <div className="col-span-1 space-y-3 md:col-span-2">
                      <Textarea
                        placeholder="Responsibilities / Achievements"
                        className="min-h-[100px]"
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(
                            exp.id,
                            "description",
                            e.target.value,
                          )
                        }
                      />

                      <Button
                        size="sm"
                        className="bg-primaryBlue hover:bg-primaryBlueHover w-full justify-center gap-2 transition-all duration-300"
                        onClick={() =>
                          handleAIGenerate(
                            "experience",
                            exp.id,
                            exp.description,
                            (res) =>
                              updateExperience(exp.id, "description", res),
                          )
                        }
                        disabled={generatingIds[exp.id] || !exp.description}
                      >
                        {generatingIds[exp.id] ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        Enhance Description
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            />

            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={handleAddExperience}
            >
              <Plus size={16} />
              Add Experience
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education" className="border-b last:border-b-0">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2 text-gray-800">
              <GraduationCap size={16} />
              Education
            </div>
          </AccordionTrigger>

          <AccordionContent className="space-y-4 px-4 pt-2 pb-4">
            <ReorderList
              items={data.education}
              onReorder={reorderEducation}
              onRemove={removeEducation}
              renderItemContent={(edu) => (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Input
                      placeholder="University"
                      className="h-9"
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(edu.id, "institution", e.target.value)
                      }
                    />

                    <Input
                      placeholder="Degree"
                      className="h-9"
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, "degree", e.target.value)
                      }
                    />

                    <Input
                      placeholder="Field of study"
                      className="h-9"
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        updateEducation(
                          edu.id,
                          "fieldOfStudy",
                          e.target.value,
                        )
                      }
                    />

                    <div className="flex gap-2">
                      <Input
                        placeholder="Start year"
                        className="h-9"
                        value={edu.startDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "startDate", e.target.value)
                        }
                      />

                      <Input
                        placeholder="End year"
                        className="h-9"
                        value={edu.endDate}
                        onChange={(e) =>
                          updateEducation(edu.id, "endDate", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-span-1 space-y-3 md:col-span-2">
                      <Textarea
                        placeholder="Activities / Achievements"
                        className="min-h-[90px]"
                        value={edu.description || ""}
                        onChange={(e) =>
                          updateEducation(
                            edu.id,
                            "description",
                            e.target.value,
                          )
                        }
                      />

                      <Button
                        size="sm"
                        className="bg-primaryBlue hover:bg-primaryBlueHover w-full justify-center gap-2 transition-all duration-300"
                        onClick={() =>
                          handleAIGenerate(
                            "education",
                            edu.id,
                            edu.description || "",
                            (res) =>
                              updateEducation(edu.id, "description", res),
                          )
                        }
                        disabled={generatingIds[edu.id] || !edu.description}
                      >
                        {generatingIds[edu.id] ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        Enhance Description
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            />

            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={handleAddEducation}
            >
              <Plus size={16} />
              Add Education
            </Button>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills" className="border-b last:border-b-0">
          <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2 text-gray-800">
              <Star size={16} />
              Skills
            </div>
          </AccordionTrigger>

          <AccordionContent className="space-y-4 px-4 pt-2 pb-4">
            <ReorderList
              items={data.skills}
              onReorder={reorderSkills}
              onRemove={removeSkill}
              renderItemContent={(skill) => (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <Input
                    placeholder="Skill"
                    className="h-9"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, e.target.value)}
                  />
                </div>
              )}
            />

            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center gap-2"
              onClick={handleAddSkill}
            >
              <Plus size={16} />
              Add Skill
            </Button>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        message={upgradeMessage}
      />

      <ImageCropDialog
        isOpen={showCropModal}
        onClose={() => setShowCropModal(false)}
        imageSrc={cropImageSrc}
        onConfirm={(blob) => handlePhotoUpload(blob)}
      />
    </>
  );
}
