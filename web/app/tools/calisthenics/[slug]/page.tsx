import Link from "next/link";
import { notFound } from "next/navigation";
import { getSkillBySlug } from "@/lib/calisthenics/queries";
import PrereqList from "../components/PrereqList";
import StatusToggle from "../components/StatusToggle";
import AttemptLogger from "../components/AttemptLogger";
import MasteryChecklist from "../components/MasteryChecklist";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function SkillDetailPage(props: { params: Params }) {
  const { slug } = await props.params;
  const skill = await getSkillBySlug(slug);
  if (!skill) notFound();

  const attempts = skill.progress?.attempts ?? [];
  const locked = skill.effective_status === "locked";

  return (
    <div className="flex flex-col gap-8">
      <nav className="flex items-center gap-2 text-xs text-[#8da2c0]">
        <Link href="/tools/calisthenics" className="hover:text-[#00a6ff]">
          ← All skills
        </Link>
      </nav>

      <header className="flex flex-col gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00a6ff]">
          {skill.category} · tier {skill.tier} · {skill.effective_status}
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
          {skill.name}
        </h1>
        {skill.description && (
          <p className="text-sm text-[#8da2c0] max-w-prose">{skill.description}</p>
        )}
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-2xl border border-[#1a2a4a] bg-[#0f1a2e]/60 p-5">
          <h2 className="font-heading text-lg font-semibold">Prerequisites</h2>
          <PrereqList slugs={skill.prerequisites} />
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-[#1a2a4a] bg-[#0f1a2e]/60 p-5">
          <h2 className="font-heading text-lg font-semibold">Status</h2>
          <StatusToggle
            skillId={skill.id}
            slug={skill.slug}
            initialStatus={skill.effective_status}
            locked={locked}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#1a2a4a] bg-[#0f1a2e]/60 p-5">
        <h2 className="font-heading text-lg font-semibold">Mastery</h2>
        <p className="text-xs text-[#8da2c0]">
          Tick conditions as you meet them. Mastered skills unlock dependents.
        </p>
        <MasteryChecklist
          skillId={skill.id}
          slug={skill.slug}
          conditions={skill.mastery_conditions}
          attempts={attempts}
          currentStatus={skill.effective_status}
        />
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-[#1a2a4a] bg-[#0f1a2e]/60 p-5">
        <h2 className="font-heading text-lg font-semibold">Attempt log</h2>
        <AttemptLogger
          skillId={skill.id}
          slug={skill.slug}
          conditions={skill.mastery_conditions}
          initialAttempts={attempts}
        />
      </section>
    </div>
  );
}
