import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData, initialResumeData, Experience, Education, Skill } from "./types";

interface CvBuilderState {
    data: ResumeData;
    activeTemplate: "classic" | "modern" | "minimal";

    // Actions
    setTemplate: (template: "classic" | "modern" | "minimal") => void;
    updatePersonalInfo: (field: keyof ResumeData["personalInfo"], value: string | boolean) => void;
    setPhoto: (url: string) => void;
    togglePhoto: (show: boolean) => void;

    // Experience
    addExperience: (exp: Experience) => void;
    updateExperience: (id: string, field: keyof Experience, value: string) => void;
    removeExperience: (id: string) => void;
    reorderExperience: (newOrder: Experience[]) => void;

    // Education
    addEducation: (edu: Education) => void;
    updateEducation: (id: string, field: keyof Education, value: string) => void;
    removeEducation: (id: string) => void;
    reorderEducation: (newOrder: Education[]) => void;

    // Skills
    addSkill: (skill: Skill) => void;
    updateSkill: (id: string, name: string) => void;
    removeSkill: (id: string) => void;
    reorderSkills: (newOrder: Skill[]) => void;

    // Reset
    resetData: () => void;
}

export const useCvBuilderStore = create<CvBuilderState>()(
    persist(
        (set) => ({
            data: initialResumeData,
            activeTemplate: "modern",

            setTemplate: (template) => set({ activeTemplate: template }),

            updatePersonalInfo: (field, value) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        personalInfo: {
                            ...state.data.personalInfo,
                            [field]: value,
                        },
                    },
                })),

            setPhoto: (url) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        personalInfo: {
                            ...state.data.personalInfo,
                            photoUrl: url,
                        },
                    },
                })),

            togglePhoto: (show) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        personalInfo: {
                            ...state.data.personalInfo,
                            showPhoto: show,
                        },
                    },
                })),

            // Experience Actions
            addExperience: (exp) =>
                set((state) => ({
                    data: { ...state.data, experience: [...state.data.experience, exp] },
                })),
            updateExperience: (id, field, value) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        experience: state.data.experience.map((e) =>
                            e.id === id ? { ...e, [field]: value } : e
                        ),
                    },
                })),
            removeExperience: (id) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        experience: state.data.experience.filter((e) => e.id !== id),
                    },
                })),
            reorderExperience: (newOrder) =>
                set((state) => ({
                    data: { ...state.data, experience: newOrder },
                })),

            // Education Actions
            addEducation: (edu) =>
                set((state) => ({
                    data: { ...state.data, education: [...state.data.education, edu] },
                })),
            updateEducation: (id, field, value) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        education: state.data.education.map((e) =>
                            e.id === id ? { ...e, [field]: value } : e
                        ),
                    },
                })),
            removeEducation: (id) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        education: state.data.education.filter((e) => e.id !== id),
                    },
                })),
            reorderEducation: (newOrder) =>
                set((state) => ({
                    data: { ...state.data, education: newOrder },
                })),

            // Skills Actions
            addSkill: (skill) =>
                set((state) => ({
                    data: { ...state.data, skills: [...state.data.skills, skill] },
                })),
            updateSkill: (id, name) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        skills: state.data.skills.map((s) =>
                            s.id === id ? { ...s, name } : s
                        ),
                    },
                })),
            removeSkill: (id) =>
                set((state) => ({
                    data: {
                        ...state.data,
                        skills: state.data.skills.filter((s) => s.id !== id),
                    },
                })),
            reorderSkills: (newOrder) =>
                set((state) => ({
                    data: { ...state.data, skills: newOrder },
                })),

            resetData: () => set({ data: initialResumeData }),
        }),
        {
            name: "cetha-cv-builder-storage",
        }
    )
);
