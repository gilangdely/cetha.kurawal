import { LayoutGrid, FileText, Video, TrendingUp } from "lucide-react";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video";
  status: "draft" | "published";
  createdAt: { _seconds: number };
}

interface BentoGridStatsContentAdminProps {
  contents: ContentItem[];
}

export default function BentoGridStatsContentAdmin({
  contents,
}: BentoGridStatsContentAdminProps) {
  const totalArticles = contents.filter((c) => c.type === "article").length;
  const totalVideos = contents.filter((c) => c.type === "video").length;
  const totalPublished = contents.filter(
    (c) => c.status === "published",
  ).length;
  const publishRate = contents.length
    ? Math.round((totalPublished / contents.length) * 100)
    : 0;

  const stats = [
    {
      label: "Total Konten",
      value: contents.length,
      icon: LayoutGrid,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Artikel",
      value: totalArticles,
      icon: FileText,
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      label: "Video",
      value: totalVideos,
      icon: Video,
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
    {
      label: "Published",
      value: totalPublished,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      sub: `${publishRate}% dari total`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className={`${s.bg} rounded-xl p-2.5`}>
              <s.icon size={18} className={s.text} />
            </div>
            {s.sub && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                {s.sub}
              </span>
            )}
          </div>
          <p className="mb-0.5 text-3xl font-bold text-gray-900">{s.value}</p>
          <p className="text-xs font-medium text-gray-500">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
