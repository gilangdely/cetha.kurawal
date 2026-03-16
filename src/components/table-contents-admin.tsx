"use client";

import { Link } from "@/i18n/navigation";
import {
  BookText,
  Edit,
  EyeOff,
  FileText,
  Globe,
  Inbox,
  MoreHorizontal,
  PlusCircle,
  Trash2,
  Video,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface ContentItem {
  id: string;
  title: string;
  type: "article" | "video";
  status: "draft" | "published";
  createdAt: { _seconds: number };
}

interface TableContentsAdminProps {
  contents: ContentItem[];
  loading: boolean;
  togglePublish: (id: string, currentStatus: string) => void;
  deleteContent: (id: string) => void;
  formatDate: (seconds?: number) => string;
}

export default function TableContentsAdmin({
  contents,
  loading,
  togglePublish,
  deleteContent,
  formatDate,
}: TableContentsAdminProps) {
  const t = useTranslations("adminContents.table");

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-8 py-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BookText size={12} strokeWidth={2.5} />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-800">
              {t("title")}
            </h2>
          </div>
          <p className="pl-8 text-xs font-medium text-slate-400">
            {t("description")}
          </p>
        </div>

        <span className="rounded-full bg-slate-50 px-4 py-1.5 text-[11px] font-bold text-slate-500 ring-1 ring-slate-100">
          {t("totalBadge", { count: contents.length })}
        </span>
      </div>

      <div className="overflow-x-auto px-4 pb-4">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="h-12 pl-6 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.title")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.type")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.status")}
              </TableHead>
              <TableHead className="h-12 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.created")}
              </TableHead>
              <TableHead className="h-12 pr-6 text-right text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                {t("columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array(4)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i} className="border-none">
                    <TableCell colSpan={5} className="px-2 py-3">
                      <div className="h-16 w-full animate-pulse rounded-2xl bg-slate-50" />
                    </TableCell>
                  </TableRow>
                ))
            ) : contents.length === 0 ? (
              <TableRow className="border-none hover:bg-transparent">
                <TableCell colSpan={5} className="py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-[2rem] bg-slate-50">
                      <Inbox className="size-8 text-slate-200" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-600">
                        {t("empty.title")}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t("empty.description")}
                      </p>
                    </div>
                    <Link
                      href="/admin/contents/create-new-contents"
                      className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-100 transition-transform hover:scale-105 active:scale-95"
                    >
                      <PlusCircle size={14} />
                      {t("empty.createButton")}
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contents.map((item) => (
                <TableRow
                  key={item.id}
                  className="group border-none transition-all duration-200 hover:bg-slate-50/80"
                >
                  <TableCell className="rounded-l-[1.5rem] py-4 pl-6">
                    <p className="text-sm leading-snug font-bold text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-slate-400 uppercase">
                      id: {item.id.slice(0, 8)}
                    </p>
                  </TableCell>

                  <TableCell className="py-4">
                    {item.type === "article" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                        <FileText size={12} />
                        {t("types.article")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
                        <Video size={12} />
                        {t("types.video")}
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="py-4">
                    <div
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-wider uppercase",
                        item.status === "published"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-amber-500/10 text-amber-600",
                      )}
                    >
                      <div
                        className={cn(
                          "size-1.5 rounded-full",
                          item.status === "published"
                            ? "bg-emerald-500"
                            : "bg-amber-500",
                        )}
                      />
                      {item.status === "published"
                        ? t("status.published")
                        : t("status.draft")}
                    </div>
                  </TableCell>

                  <TableCell className="py-4 text-sm text-slate-500">
                    {formatDate(item.createdAt?._seconds)}
                  </TableCell>

                  <TableCell className="rounded-r-[1.5rem] pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white hover:shadow-sm hover:ring-1 hover:ring-slate-200 active:scale-90">
                          <MoreHorizontal
                            size={18}
                            className="text-slate-400"
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-44 rounded-2xl border-slate-100 p-2 shadow-xl ring-0"
                      >
                        <DropdownMenuItem
                          onClick={() => togglePublish(item.id, item.status)}
                          className="cursor-pointer rounded-xl py-2"
                        >
                          {item.status === "published" ? (
                            <>
                              <EyeOff
                                size={14}
                                className="mr-2 text-slate-500"
                              />
                              <span className="text-xs font-bold text-slate-600">
                                {t("actions.unpublish")}
                              </span>
                            </>
                          ) : (
                            <>
                              <Globe size={14} className="mr-2 text-blue-500" />
                              <span className="text-xs font-bold text-blue-500">
                                {t("actions.publish")}
                              </span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl"
                        >
                          <Link
                            href={`/admin/contents/${item.id}/edit-contents`}
                            className="flex items-center py-2"
                          >
                            <Edit size={14} className="mr-2 text-slate-500" />
                            <span className="text-xs font-bold text-slate-600">
                              {t("actions.edit")}
                            </span>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-slate-50" />

                        <DropdownMenuItem
                          onClick={() => deleteContent(item.id)}
                          className="cursor-pointer rounded-xl py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                        >
                          <Trash2 size={14} className="mr-2 text-rose-600" />
                          <span className="text-xs font-bold tracking-wider">
                            {t("actions.delete")}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
