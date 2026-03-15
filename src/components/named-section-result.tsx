import { Check } from "lucide-react";

type ColorScheme = {
  bg: string; // Background color
  text: string; // Text color
  hoverBg: string; // Hover background color
};

const colorSchemes: Record<string, ColorScheme> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    hoverBg: "group-hover:bg-blue-100",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    hoverBg: "group-hover:bg-green-100",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    hoverBg: "group-hover:bg-amber-100",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    hoverBg: "group-hover:bg-purple-100",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-600",
    hoverBg: "group-hover:bg-red-100",
  },
};

const NamedSectionResult = ({
  title,
  list,
  icon,
  color = "blue",
  eyebrow,
  className = "",
}: {
  title: string;
  list: string[];
  icon?: React.ReactNode;
  color?: string;
  eyebrow?: string;
  className?: string;
}) => {
  // Get color scheme or fallback to blue
  const colorScheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div
      className={`rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.07)] ${className}`}
    >
      <div className="mb-5">
        {eyebrow && (
          <div
            className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase ${colorScheme.bg} ${colorScheme.text}`}
          >
            {eyebrow}
          </div>
        )}

        <h3 className="text-TextPrimary flex items-center gap-3 text-lg font-semibold md:text-xl">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${colorScheme.bg} ${colorScheme.text}`}
          >
            {icon}
          </div>
          <span>{title}</span>
        </h3>
      </div>

      <ul className="space-y-3">
        {list.map((item, i) => (
          <li
            key={i}
            className="group flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 transition hover:border-slate-200 hover:bg-white"
          >
            <span
              className={`mt-0.5 inline-flex items-center justify-center rounded-full ${colorScheme.bg} p-1.5 ${colorScheme.text} ${colorScheme.hoverBg} transition-colors`}
            >
              <Check size={12} />
            </span>
            <span className="text-sm leading-relaxed text-slate-700">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NamedSectionResult;
