import { TrendingUp } from "lucide-react";

interface ScoreCardProps {
  label: string;
  value: number;
}

export default function ScoreCard({ label, value }: ScoreCardProps) {
  return (
    <div className="relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* icon kanan atas */}
      <TrendingUp className="text-primaryBlue absolute top-3 right-3 h-5 w-5" />

      {/* label */}
      <p className="text-sm text-slate-500">{label}</p>

      {/* score */}
      <p className="text-primaryBlue mt-2 text-lg font-semibold">
        {value} / 100
      </p>

      {/* progress bar */}
      <div className="mt-3 h-2 w-full rounded-full bg-slate-200">
        <div
          className="bg-primaryBlue h-2 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
