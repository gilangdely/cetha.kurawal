import { ArrowUpRight, Compass, ExternalLink, Link2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Helper untuk mendapatkan domain dari URL
const getDomain = (url: string) => {
  try {
    const domain = new URL(url).hostname;
    return domain;
  } catch (error) {
    return "";
  }
};

const JobLinksSection = ({ jobResult }: { jobResult: any }) => {
  return (
    <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5 md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-blue-700 uppercase">
            <Compass size={13} />
            Job Hunt Shortcut
          </div>

          <h3 className="text-TextPrimary flex items-center gap-3 text-xl font-semibold">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Link2 size={20} />
            </div>
            <span>Tautan Pencarian Pekerjaan</span>
          </h3>
        </div>

        <p className="max-w-md text-sm leading-relaxed text-slate-500">
          Buka platform yang paling relevan dan langsung lanjut ke lowongan yang
          sesuai dengan role target kamu.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Object.entries(jobResult.tautan_pencarian).map(
          ([platform, link]: [any, any]) => {
            const domain = getDomain(link);
            const faviconUrl = domain
              ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
              : "";

            return (
              <Link
                key={platform}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-[20px] border border-slate-200 bg-white px-4 py-4 text-slate-800 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {faviconUrl && (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-100">
                      <Image
                        src={faviconUrl}
                        alt={platform}
                        width={40}
                        height={40}
                        className="h-full w-full object-contain p-2"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">{platform}</p>
                    <p className="text-xs text-slate-500">Buka platform</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-500 transition group-hover:text-slate-900">
                  <span className="hidden sm:inline">Explore</span>
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            );
          },
        )}
      </div>
    </div>
  );
};

export default JobLinksSection;
