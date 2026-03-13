import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ResumeData,
  initialResumeData,
  Experience,
  Education,
  Skill,
} from "../types/build-cv";

interface CvStyle {
  fontFamily: string;
  fontColor: string;
}

interface CvHistoryState {
  data: ResumeData;
  style: CvStyle;
  activeTemplate: "classic" | "modern" | "minimal";
}

interface CvBuilderState {
  data: ResumeData;
  activeTemplate: "classic" | "modern" | "minimal";
  style: CvStyle;

  // History
  pastStates: CvHistoryState[];
  futureStates: CvHistoryState[];
  _saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Template
  setTemplate: (template: "classic" | "modern" | "minimal") => void;

  // Style
  setFontFamily: (font: string) => void;
  setFontColor: (color: string) => void;

  // Personal
  updatePersonalInfo: (
    field: keyof ResumeData["personalInfo"],
    value: string | boolean,
  ) => void;
  setPhoto: (url: string) => void;
  togglePhoto: (show: boolean) => void;

  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (
    id: string,
    field: keyof Experience,
    value: string,
  ) => void;
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

  resetData: () => void;
}

export const useCvBuilderStore = create<CvBuilderState>()(
  persist(
    (set, get) => ({
      data: initialResumeData,
      activeTemplate: "modern",

      style: {
        fontFamily: "Inter",
        fontColor: "#111827",
      },

      pastStates: [],
      futureStates: [],

      _saveHistory: () => {
        const state = get();
        const currentState: CvHistoryState = {
          data: state.data,
          style: state.style,
          activeTemplate: state.activeTemplate,
        };
        set({
          pastStates: [...state.pastStates, currentState],
          futureStates: [], // Clear future on new action
        });
      },

      undo: () => {
        const state = get();
        if (state.pastStates.length === 0) return;

        const previousState = state.pastStates[state.pastStates.length - 1];
        const newPastStates = state.pastStates.slice(0, -1);

        const currentState: CvHistoryState = {
          data: state.data,
          style: state.style,
          activeTemplate: state.activeTemplate,
        };

        set({
          ...previousState,
          pastStates: newPastStates,
          futureStates: [currentState, ...state.futureStates],
        });
      },

      redo: () => {
        const state = get();
        if (state.futureStates.length === 0) return;

        const nextState = state.futureStates[0];
        const newFutureStates = state.futureStates.slice(1);

        const currentState: CvHistoryState = {
          data: state.data,
          style: state.style,
          activeTemplate: state.activeTemplate,
        };

        set({
          ...nextState,
          pastStates: [...state.pastStates, currentState],
          futureStates: newFutureStates,
        });
      },

      setTemplate: (template) => {
        get()._saveHistory();
        set({ activeTemplate: template });
      },

      setFontFamily: (font) => {
        get()._saveHistory();
        set((state) => ({
          style: { ...state.style, fontFamily: font },
        }));
      },

      setFontColor: (color) => {
        get()._saveHistory();
        set((state) => ({
          style: { ...state.style, fontColor: color },
        }));
      },

      updatePersonalInfo: (field, value) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: {
              ...state.data.personalInfo,
              [field]: value,
            },
          },
        }));
      },

      setPhoto: (url) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: {
              ...state.data.personalInfo,
              photoUrl: url,
            },
          },
        }));
      },

      togglePhoto: (show) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: {
              ...state.data.personalInfo,
              showPhoto: show,
            },
          },
        }));
      },

      addExperience: (exp) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, experience: [...state.data.experience, exp] },
        }));
      },

      updateExperience: (id, field, value) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) =>
              e.id === id ? { ...e, [field]: value } : e,
            ),
          },
        }));
      },

      removeExperience: (id) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.filter((e) => e.id !== id),
          },
        }));
      },

      reorderExperience: (newOrder) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, experience: newOrder },
        }));
      },

      addEducation: (edu) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, education: [...state.data.education, edu] },
        }));
      },

      updateEducation: (id, field, value) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) =>
              e.id === id ? { ...e, [field]: value } : e,
            ),
          },
        }));
      },

      removeEducation: (id) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((e) => e.id !== id),
          },
        }));
      },

      reorderEducation: (newOrder) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, education: newOrder },
        }));
      },

      addSkill: (skill) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, skills: [...state.data.skills, skill] },
        }));
      },

      updateSkill: (id, name) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((s) =>
              s.id === id ? { ...s, name } : s,
            ),
          },
        }));
      },

      removeSkill: (id) => {
        get()._saveHistory();
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((s) => s.id !== id),
          },
        }));
      },

      reorderSkills: (newOrder) => {
        get()._saveHistory();
        set((state) => ({
          data: { ...state.data, skills: newOrder },
        }));
      },

      resetData: () => {
        get()._saveHistory();
        set({ data: initialResumeData });
      },
    }),
    {
      name: "cetha-cv-builder-storage",
    },
  ),
);
