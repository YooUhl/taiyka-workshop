import type { Category } from "@/lib/calisthenics/types";

type Props = {
  category: Category;
  mastered: number;
  total: number;
};

const CATEGORY_LABEL: Record<Category, string> = {
  push: "Push",
  pull: "Pull",
  core: "Core",
  legs: "Legs",
  static: "Static",
  dynamic: "Dynamic",
};

export default function CategoryProgress({ category, mastered, total }: Props) {
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#00a6ff] min-w-[72px]">
        {CATEGORY_LABEL[category]}
      </p>
      <div className="flex-1 h-1.5 rounded-full bg-[#1a2a4a] overflow-hidden">
        <div
          className="h-full bg-[#00a6ff]/70 transition-[width]"
          style={{ width: `${pct}%` }}
          aria-hidden
        />
      </div>
      <p className="font-mono text-[10px] text-[#8da2c0] min-w-[48px] text-right">
        {mastered}/{total}
      </p>
    </div>
  );
}
