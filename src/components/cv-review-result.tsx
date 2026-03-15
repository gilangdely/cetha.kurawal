import { useDataReviewStore } from "@/store/dataReviewStore";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  TrendingUp,
  CircleCheckBig,
  Lightbulb,
  Puzzle,
} from "lucide-react";
import ScoreCard from "./ui/scored-card";

export interface Reviewdata {
  skor_keseluruhan: number;
  penilaian_per_kategori: PenilaianPerKategori;
  highlights: Highlight[];
  improvements: Improvement[];
  kesimpulan?: string;
}

export interface PenilaianPerKategori {
  kelengkapan_informasi: number;
  keterbacaan_dan_format: number;
  dampak_pengalaman_kerja: number;
}

export interface Highlight {
  point: string;
  explanation: string;
}

export interface Improvement {
  point: string;
  explanation: string;
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

const CvReviewResult = () => {
  const reviewData = useDataReviewStore((state) => state.reviewData);
  const resultData = reviewData?.result?.[0];

  if (!resultData) {
    return (
      <div className="text-sm text-gray-500">
        Data penilaian belum tersedia.
      </div>
    );
  }

  const {
    skor_keseluruhan,
    penilaian_per_kategori,
    highlights,
    improvements,
    kesimpulan,
  } = resultData as unknown as Reviewdata;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white shadow-lg">
        <div className="absolute top-6 right-6 opacity-20">
          <TrendingUp size={80} />
        </div>

        <p className="text-sm opacity-80">Overall Score</p>

        <div className="mt-2 flex items-end gap-2">
          <span className="text-6xl font-bold">{skor_keseluruhan}</span>
          <span className="text-xl opacity-80">/100</span>
        </div>

        <p className="mt-2 text-sm opacity-80">
          Seberapa kuat kualitas CV kamu menurut AI
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard
          label="Kelengkapan Informasi"
          value={penilaian_per_kategori.kelengkapan_informasi}
        />
        <ScoreCard
          label="Keterbacaan dan Format"
          value={penilaian_per_kategori.keterbacaan_dan_format}
        />
        <ScoreCard
          label="Dampak Pengalaman Kerja"
          value={penilaian_per_kategori.dampak_pengalaman_kerja}
        />
      </div>

      {highlights?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CircleCheckBig className="text-green-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Yang Sudah Bagus
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {highlights.map((item: Highlight, i: number) => (
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

      {improvements?.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="text-amber-500" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Yang Bisa Ditingkatkan
            </h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {improvements.map((item: Improvement, i: number) => (
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

      {kesimpulan && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-2 flex items-center gap-2">
            <Puzzle className="text-blue-500" size={20} />
            <h3 className="font-semibold text-gray-900">Kesimpulan AI</h3>
          </div>

          <div className="text-gray-700">
            <MarkdownText>{kesimpulan}</MarkdownText>
          </div>
        </div>
      )}
    </div>
  );
};

export default CvReviewResult;
