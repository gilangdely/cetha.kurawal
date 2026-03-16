import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface LastContentAdminProps {
  contents: any[];
  loading: boolean;
}

export function LastContentAdmin({ contents, loading }: LastContentAdminProps) {
  const t = useTranslations("adminDashboard.lastContent");

  const formatDate = (seconds?: number) => {
    if (!seconds) return "-";
    const date = new Date(seconds * 1000);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return t("time.justNow");
    if (mins < 60) return t("time.minutesAgo", { value: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return t("time.hoursAgo", { value: hrs });
    return t("time.daysAgo", { value: Math.floor(hrs / 24) });
  };

  return (
    <Card className="border-border/60 h-full overflow-hidden">
      <CardHeader className="pt-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{t("title")}</CardTitle>
          <div className="text-xs text-blue-600 hover:text-blue-700">
            <Link
              href="/admin/contents"
              className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
            >
              {t("seeAll")} <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex gap-4 p-6">
            <div className="bg-muted h-32 w-32 animate-pulse rounded-lg" />
            <div className="flex-1 space-y-3">
              <div className="bg-muted h-4 w-48 animate-pulse rounded" />
              <div className="bg-muted h-3 w-32 animate-pulse rounded" />
              <div className="bg-muted h-3 w-40 animate-pulse rounded" />
            </div>
          </div>
        ) : contents.length === 0 ? (
          <div className="text-muted-foreground flex h-40 items-center justify-center text-xs">
            {t("empty")}
          </div>
        ) : (
          <div className="divide-y">
            {contents.slice(0, 1).map((item) => {
              const typeColor =
                item.type === "article" ? "text-violet-700" : "text-rose-700";
              const typeBg =
                item.type === "article" ? "bg-violet-50" : "bg-rose-50";
              const statusColor =
                item.status === "published"
                  ? "text-emerald-700"
                  : "text-amber-700";
              const statusBg =
                item.status === "published" ? "bg-emerald-50" : "bg-amber-50";
              return (
                <div
                  key={item.id}
                  className="hover:bg-muted/40 flex flex-col gap-4 p-4 transition-colors"
                >
                  <div className="border-border/60 bg-muted relative h-32 w-full overflow-hidden rounded-lg border">
                    {item.coverImageUrl ? (
                      <Image
                        src={item.coverImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="100%"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <FileText className="text-muted-foreground h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex justify-between gap-2">
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className={cn("text-xs", typeBg, typeColor)}
                        >
                          {item.type === "article"
                            ? t("types.article")
                            : t("types.video")}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusBg, statusColor)}
                        >
                          {item.status === "published"
                            ? t("status.published")
                            : t("status.draft")}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {formatDate(item.createdAt?._seconds)}
                      </div>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {item.excerpt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
