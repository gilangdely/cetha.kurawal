import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Lightbulb,
  Puzzle,
  TrendingUp,
  Check,
  CircleCheck,
  CircleCheckBig,
} from "lucide-react";
import ScoreCard from "./ui/scored-card";

interface AnalysisResult {
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

interface Props {
  result: AnalysisResult;
  className?: string;
}

const MarkdownText = ({ children }: { children: string }) => (
  <ReactMarkdown
    components={{
      p: ({ children }) => (
        <p className="text-sm leading-relaxed text-gray-600">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
          {children}
        </ul>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-gray-900">{children}</strong>
      ),
    }}
  >
    {children}
  </ReactMarkdown>
);

const NumberBadge = ({ number }: { number: number }) => (
  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
    {number}
  </div>
);

const LinkedInAnalysisResult: React.FC<Props> = ({
  result,
  className = "",
}) => {
  if (!result) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* HEADER */}
      <div className="flex items-center gap-2">
        <Sparkles className="text-primaryBlue" size={22} />
        <h2 className="text-xl font-semibold text-gray-900">
          AI LinkedIn Review
        </h2>
      </div>

      {/* HERO SCORE */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white shadow-lg">
        <div className="absolute top-6 right-6 opacity-20">
          <TrendingUp size={80} />
        </div>

        <p className="text-sm opacity-80">Overall Score</p>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-6xl font-bold">{result.skor_keseluruhan}</span>
          <span className="text-xl opacity-80">/100</span>
        </div>

        <p className="mt-2 text-sm opacity-80">
          Seberapa kuat profil LinkedIn kamu menurut AI
        </p>
      </div>

      {/* CATEGORY SCORES */}
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Kelengkapan Profil"
          value={result.penilaian_per_kategori.kelengkapan_informasi}
        />
        <ScoreCard
          label="Keterbacaan"
          value={result.penilaian_per_kategori.keterbacaan_dan_format}
        />
        <ScoreCard
          label="Impact Pengalaman"
          value={result.penilaian_per_kategori.dampak_pengalaman_kerja}
        />
      </div>

      {/* HIGHLIGHTS */}
      {result.highlights?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CircleCheckBig className="text-green-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Yang Sudah Bagus
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {result.highlights.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <NumberBadge number={i + 1} />

                  <div>
                    <p className="font-semibold text-gray-900">{item.point}</p>

                    <div className="mt-1 text-gray-600">
                      <MarkdownText>{item.explanation}</MarkdownText>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IMPROVEMENTS */}
      {result.improvements?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Yang Bisa Ditingkatkan
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {result.improvements.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <NumberBadge number={i + 1} />

                  <div>
                    <p className="font-semibold text-gray-900">{item.point}</p>

                    <div className="mt-1 text-gray-600">
                      <MarkdownText>{item.explanation}</MarkdownText>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CONCLUSION */}
      {result.kesimpulan && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <Puzzle className="text-blue-500" size={20} />
            <h3 className="font-semibold text-gray-900">Kesimpulan AI</h3>
          </div>

          <div className="text-gray-700">
            <MarkdownText>{result.kesimpulan}</MarkdownText>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedInAnalysisResult;
