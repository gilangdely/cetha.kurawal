import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Position {
  companyName: string;
  companyId?: string;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  title?: string;
  subTitle?: string;
  description?: string;
  duration?: string;
}

interface Experience {
  companyName: string;
  companyId?: string;
  companyLink?: string;
  companyLogo?: string;
  location?: string;
  title?: string;
  subTitle?: string;
  description?: string;
  duration?: string;
  totalDuration?: string;
  isMultiPositions?: boolean;
  positions?: Position[];
}

interface Education {
  duration: string;
  university: string;
  universityLink?: string;
  degree?: string;
  description?: string;
  subDescription?: string;
}

interface Overview {
  fullName: string;
  headline: string;
  profilePictureURL: string;
  backgroundImageURL: string;
  location?: { fullLocation?: string };
  followerCount?: number;
  connectionsCount?: number;
  CurrentPositions?: { name: string; logoURL: string; url: string }[];
}

interface Detail {
  about?: string;
  positions?: Position[];
  featuredPosts?: { postLink: string; postText: string }[];
  languages?: {
    languages: { Language: string; Level: string }[];
  };
}

interface Profile {
  overview: Overview;
  details: Detail;
  experience: Experience[];
  education: Education[];
}

interface LinkedinAnalysisResult {
  skor_keseluruhan: number;
  penilaian_per_kategori: {
    kelengkapan_informasi: number;
    keterbacaan_dan_format: number;
    dampak_pengalaman_kerja: number;
  };
  highlights: {
    point: string;
    explanation: string;
  }[];
  improvements: {
    point: string;
    explanation: string;
  }[];
  kesimpulan: string;
}

interface LinkedinResultState {
  profile: Profile | null;
  analysis: LinkedinAnalysisResult | null;
  setResult: (payload: {
    profile: Profile;
    analysis: LinkedinAnalysisResult;
  }) => void;
  clearResult: () => void;
}

export const useLinkedinResultStore = create<LinkedinResultState>()(
  persist(
    (set) => ({
      profile: null,
      analysis: null,
      setResult: ({ profile, analysis }) => set({ profile, analysis }),
      clearResult: () => set({ profile: null, analysis: null }),
    }),
    {
      name: "linkedin-result-store",
    },
  ),
);
