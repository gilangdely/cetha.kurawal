import { ArrowUpRight, Target, Zap, Briefcase } from "lucide-react";
import UserQuotaWidget from "@/components/dashboard/user-quota-widget";

const stats = [
  {
    label: "Pekerjaan Impian",
    value: "Product Designer",
    icon: Target,
    theme: "bg-primaryBlue text-white",
  },
  {
    label: "Career Score",
    value: "82 / 100",
    icon: Zap,
    theme: "bg-white border border-slate-200 text-slate-900",
  },
  {
    label: "Total Pencapaian",
    value: "14 Jobs",
    icon: Briefcase,
    theme: "bg-white border border-slate-200 text-slate-900",
  },
];

const BentoGridDashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <div
            key={i}
            className={`group relative flex flex-col justify-between rounded-3xl p-5 transition-all duration-300 hover:shadow-sm ${stat.theme}`}
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black/5">
                  <Icon size={21} strokeWidth={2.5} />
                </div>

                <div>
                  <p className="text-sm font-medium opacity-70">{stat.label}</p>
                  <p className="text-xl font-black tracking-tight">
                    {stat.value}
                  </p>
                </div>
              </div>

              <ArrowUpRight
                size={18}
                className="opacity-40 transition group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </div>
          </div>
        );
      })}

      <UserQuotaWidget />
    </div>
  );
};

export default BentoGridDashboard;
