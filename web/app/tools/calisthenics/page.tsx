import { listSkillsWithProgress } from "@/lib/calisthenics/queries";
import SkillTree from "./components/SkillTree";

export const dynamic = "force-dynamic";

export default async function CalisthenicsPage() {
  const skills = await listSkillsWithProgress();
  const masteredCount = skills.filter((s) => s.effective_status === "mastered").length;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00a6ff]">
          Tool 02 · skill tree
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          Calisthenics
        </h1>
        <p className="text-sm text-[#8da2c0]">
          {skills.length === 0 ? (
            <>No skills seeded yet. Run the SQL migration in <code className="text-[#00e5ff]">web/sql/001_calisthenics.sql</code> or POST to <code className="text-[#00e5ff]">/tools/calisthenics/seed</code>.</>
          ) : (
            <>{masteredCount} mastered · {skills.length} total · tiers 1–10 left to right.</>
          )}
        </p>
      </header>

      {skills.length > 0 && <SkillTree skills={skills} />}
    </div>
  );
}
