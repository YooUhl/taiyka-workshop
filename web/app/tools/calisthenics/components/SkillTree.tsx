import { CATEGORIES, type Category, type SkillWithProgress } from "@/lib/calisthenics/types";
import SkillNode from "./SkillNode";
import CategoryProgress from "./CategoryProgress";

type Props = {
  skills: SkillWithProgress[];
};

const TIERS = Array.from({ length: 10 }, (_, i) => i + 1);

export default function SkillTree({ skills }: Props) {
  // Index dependents (slug → count of skills that have it in prerequisites)
  const dependentsCount = new Map<string, number>();
  for (const s of skills) {
    for (const prereq of s.prerequisites) {
      dependentsCount.set(prereq, (dependentsCount.get(prereq) ?? 0) + 1);
    }
  }

  const byCategory = new Map<Category, SkillWithProgress[]>();
  for (const c of CATEGORIES) byCategory.set(c, []);
  for (const s of skills) {
    byCategory.get(s.category)?.push(s);
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1024px] flex flex-col gap-8">
        {/* Tier header */}
        <div
          className="grid gap-2 px-[88px]"
          style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}
          aria-hidden
        >
          {TIERS.map((t) => (
            <p
              key={t}
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0] text-center"
            >
              Tier {t}
            </p>
          ))}
        </div>

        {CATEGORIES.map((cat) => {
          const rows = byCategory.get(cat) ?? [];
          const mastered = rows.filter((s) => s.effective_status === "mastered").length;
          return (
            <section key={cat} className="flex flex-col gap-3">
              <CategoryProgress category={cat} mastered={mastered} total={rows.length} />
              <div
                className="grid gap-2 min-h-[72px]"
                style={{ gridTemplateColumns: "repeat(10, minmax(0, 1fr))" }}
                role="list"
                aria-label={`${cat} skills`}
              >
                {rows.length === 0 && (
                  <p className="col-span-10 text-center text-xs text-[#8da2c0] italic py-4">
                    No skills seeded in this category yet.
                  </p>
                )}
                {rows.map((s) => (
                  <SkillNode
                    key={s.id}
                    skill={s}
                    hasDependents={(dependentsCount.get(s.slug) ?? 0) > 0}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
