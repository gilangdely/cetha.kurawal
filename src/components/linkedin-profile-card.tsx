import { useState } from "react";
import Image from "next/image";
import { Locate, MapPin, UserPlus, Users } from "lucide-react";

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

interface LinkedInProfileDisplayProps {
  profile: Profile;
  className?: string;
}

const LinkedInProfileDisplay: React.FC<LinkedInProfileDisplayProps> = ({
  profile,
  className = "",
}) => {
  const [showAllEducation, setShowAllEducation] = useState(false);

  const { overview, details, experience, education } = profile;

  return (
    <div className="w-full space-y-3">
      {/* ── Profile Card ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {/* Banner */}
        <div className="relative h-36 w-full bg-gray-100">
          {overview.backgroundImageURL ? (
            <Image
              src={overview.backgroundImageURL}
              alt="Banner"
              fill
              className="z-0 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>

        <div className="relative px-6 pb-6">
          <div className="-mt-10 mb-4 flex justify-between gap-6">
            {overview.profilePictureURL ? (
              <Image
                src={overview.profilePictureURL}
                alt={overview.fullName}
                width={100}
                height={100}
                className="z-10 rounded-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-sm font-medium text-gray-400 shadow-sm" />
            )}
          </div>
          <div className="flex justify-between gap-6">
            <div className="space-y-3">
              {/* Name */}
              <h1 className="text-2xl leading-tight font-bold text-gray-900">
                {overview.fullName}
              </h1>

              {/* Headline */}
              {overview.headline && (
                <p className="max-w-xl text-sm leading-snug text-gray-500">
                  {overview.headline}
                </p>
              )}

              {/* Location */}
              {overview.location?.fullLocation && (
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin size={14} />
                  <span>{overview.location.fullLocation}</span>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {overview.followerCount && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    <Users size={14} />
                    {overview.followerCount.toLocaleString()} pengikut
                  </span>
                )}

                {overview.connectionsCount && (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                    <UserPlus size={14} />
                    {overview.connectionsCount.toLocaleString()} koneksi
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── About ── */}
      {/* ── About ── */}
      {details.about && (
        <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5">
          <SectionTitle>Tentang</SectionTitle>

          <p className="mt-3 text-justify text-sm leading-relaxed whitespace-pre-line text-gray-600">
            {details.about}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {/* ── Experience ── */}
        {experience && experience.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5">
            <SectionTitle>Pengalaman</SectionTitle>

            <ul className="mt-4 space-y-6">
              {experience.map((exp, i) => (
                <li key={i} className="flex gap-4">
                  {/* Logo */}
                  <div className="mt-0.5 flex-shrink-0">
                    {exp.companyLogo ? (
                      <Image
                        src={exp.companyLogo}
                        alt={exp.companyName}
                        width={44}
                        height={44}
                        className="rounded-xl border border-gray-100 bg-white object-contain"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <rect x="2" y="7" width="20" height="14" rx="2" />
                          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900">
                      {exp.companyName}
                    </p>

                    {exp.totalDuration && (
                      <p className="mt-0.5 text-xs text-gray-400">
                        {exp.totalDuration}
                      </p>
                    )}

                    {exp.positions && exp.positions.length > 0 ? (
                      <div className="mt-3 space-y-3 border-l border-gray-100 pl-3">
                        {exp.positions.map((pos, j) => (
                          <div key={j}>
                            <p className="text-sm font-medium text-gray-800">
                              {pos.title}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-400">
                              {pos.duration}
                            </p>

                            {pos.description && (
                              <p className="mt-1 text-justify text-sm leading-relaxed text-gray-600">
                                {pos.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {exp.title && (
                          <p className="mt-0.5 text-sm text-gray-700">
                            {exp.title}
                          </p>
                        )}

                        {exp.duration && (
                          <p className="mt-0.5 text-xs text-gray-400">
                            {exp.duration}
                          </p>
                        )}

                        {exp.description && (
                          <p className="mt-1.5 text-justify text-sm leading-relaxed text-gray-600">
                            {exp.description}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Education ── */}
        {education && education.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-5">
            <SectionTitle>Pendidikan</SectionTitle>

            <ul className="mt-4 space-y-5">
              {(showAllEducation ? education : education.slice(0, 2)).map(
                (edu, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-400">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c3 3 9 3 12 0v-5" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {edu.university}
                      </p>

                      {edu.degree && (
                        <p className="mt-0.5 text-sm text-gray-600">
                          {edu.degree}
                        </p>
                      )}

                      {edu.duration && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          {edu.duration}
                        </p>
                      )}
                    </div>
                  </li>
                ),
              )}
            </ul>

            {education.length > 2 && (
              <button
                onClick={() => setShowAllEducation((p) => !p)}
                className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-700"
              >
                {showAllEducation ? (
                  <>
                    Sembunyikan <span className="text-[10px]">▲</span>
                  </>
                ) : (
                  <>
                    Lihat semua {education.length} pendidikan{" "}
                    <span className="text-[10px]">▼</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Reusable section heading ── */
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <h2 className="text-[0.7rem] font-semibold tracking-widest text-gray-400 uppercase">
    {children}
  </h2>
);

export default LinkedInProfileDisplay;
