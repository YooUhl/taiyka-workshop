import Link from "next/link";
import { getSkillNamesBySlugs } from "@/lib/calisthenics/queries";

type Props = {
  slugs: string[];
};

export default async function PrereqList({ slugs }: Props) {
  if (slugs.length === 0) {
    return (
      <p className="text-sm text-[#8da2c0] italic">No prerequisites — entry-level skill.</p>
    );
  }
  const rows = await getSkillNamesBySlugs(slugs);
  const byslug = new Map(rows.map((r) => [r.slug, r.name]));

  return (
    <ul className="flex flex-col gap-2">
      {slugs.map((s) => {
        const name = byslug.get(s);
        if (!name) {
          return (
            <li key={s} className="text-sm text-[#c92a2a]">
              ⚠ Missing prereq: <code>{s}</code>
            </li>
          );
        }
        return (
          <li key={s}>
            <Link
              href={`/tools/calisthenics/${s}`}
              className="text-sm text-[#00a6ff] hover:text-[#00e5ff] underline-offset-4 hover:underline"
            >
              {name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
