import { LayoutGrid, FileText, Video, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video";
  status: "draft" | "published";
  createdAt: { _seconds: number };
}

interface ContentStatsContentAdminProps {
  contents: ContentItem[];
}

export default function ContentStatsContentAdmin({
  contents,
}: ContentStatsContentAdminProps) {
  const t = useTranslations("adminContents.stats");

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
      label: t("total.label"),
      sublabel: t("total.sublabel"),
      value: contents.length,
      icon: LayoutGrid,
      bg: "bg-blue-50/60",
      text: "text-blue-600",
    },
    {
      label: t("article.label"),
      sublabel: t("article.sublabel"),
      value: totalArticles,
      icon: FileText,
      bg: "bg-violet-50/60",
      text: "text-violet-600",
    },
    {
      label: t("video.label"),
      sublabel: t("video.sublabel"),
      value: totalVideos,
      icon: Video,
      bg: "bg-rose-50/60",
      text: "text-rose-600",
    },
    {
      label: t("published.label"),
      sublabel: t("published.sublabel"),
      value: totalPublished,
      icon: TrendingUp,
      bg: "bg-emerald-50/60",
      text: "text-emerald-600",
      sub: t("published.rate", { value: publishRate }),
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-slate-200 p-6 shadow-sm transition-all duration-300 hover:border-slate-400"
        >
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
              s.bg,
            )}
          >
            <s.icon size={24} strokeWidth={1.5} className={s.text} />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-[0.2em] text-slate-300 uppercase">
              {s.sublabel}
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-bold tracking-tight text-slate-900">
                {s.value}
              </h3>
              <p className="text-sm font-semibold text-slate-500">{s.label}</p>
            </div>
          </div>

          <div className="absolute top-1/2 right-5 -translate-y-1/2 opacity-[0.03] grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.08]">
            <s.icon size={76} strokeWidth={1} />
          </div>
        </div>
      ))}
    </div>
  );
}
