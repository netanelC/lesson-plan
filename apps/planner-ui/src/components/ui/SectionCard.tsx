import type { ReactNode } from "react";
import { clsx } from "clsx";

type SectionTheme = "indigo" | "orange" | "green";

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  theme: SectionTheme;
  children: ReactNode;
  className?: string;
}

const THEME_STYLES: Record<SectionTheme, string> = {
  indigo: "bg-[#F8FAFF] border-indigo-500/10", // Light Blue/Indigo
  orange: "bg-[#FFF9F5] border-orange-500/10", // Light Orange
  green: "bg-[#F0FFF4] border-emerald-500/10", // Light Green
};

const TITLE_COLORS: Record<SectionTheme, string> = {
  indigo: "text-indigo-800",
  orange: "text-orange-800",
  green: "text-emerald-800",
};

export const SectionCard = ({
  title,
  icon,
  theme,
  children,
  className,
}: SectionCardProps) => {
  return (
    <section
      className={clsx(
        "space-y-4 rounded-lg p-6 shadow-sm border",
        THEME_STYLES[theme],
        className,
      )}
    >
      <h3
        className={clsx(
          "text-lg font-bold flex items-center gap-2",
          TITLE_COLORS[theme],
        )}
      >
        <span className="text-current opacity-80">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
};
