import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ProgressStatus, SkillWithProgress } from "@/lib/calisthenics/types";

type Props = {
  skill: SkillWithProgress;
  hasDependents: boolean;
};

const STATUS_STYLES: Record<ProgressStatus, string> = {
  locked:
    "border-[#1a2a4a] bg-[#0f1a2e]/40 text-[#8da2c0] opacity-50",
  unlocked:
    "border-[#00a6ff]/60 bg-[#0f1a2e]/70 text-[#e8f0fe]",
  practicing:
    "border-[#00a6ff] bg-[#0f1a2e] text-[#e8f0fe] shadow-hud-ring",
  mastered:
    "border-[#00e5ff] bg-[#0f1a2e] text-[#e8f0fe] shadow-glow",
};

const STATUS_LABEL: Record<ProgressStatus, string> = {
  locked: "Locked",
  unlocked: "Unlocked",
  practicing: "Practicing",
  mastered: "Mastered",
};

function LockIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function SkillNode({ skill, hasDependents }: Props) {
  const status = skill.effective_status;
  const locked = status === "locked";
  const hasPrereqs = skill.prerequisites.length > 0;

  return (
    <Link
      href={`/tools/calisthenics/${skill.slug}`}
      aria-label={`${skill.name} — ${STATUS_LABEL[status]}`}
      style={{
        gridColumn: skill.tier,
        ...(hasPrereqs ? { borderLeftStyle: "dashed" as const } : null),
        ...(hasDependents ? { borderRightStyle: "dashed" as const } : null),
      }}
      className={cn(
        "group block rounded-lg border-2 px-3 py-2.5 transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00a6ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1628]",
        "hover:scale-[1.03]",
        STATUS_STYLES[status],
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8da2c0]">
          T{skill.tier}
        </p>
        {locked && <LockIcon />}
      </div>
      <p className="mt-1 font-semibold text-sm leading-tight">{skill.name}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] opacity-70">
        {STATUS_LABEL[status]}
      </p>
    </Link>
  );
}
