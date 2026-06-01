import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getIdea,
  getSections,
  getBroll,
  getAssets,
  listAllTags,
} from "@/lib/content/queries";
import IdeaEditor from "../components/IdeaEditor";
import SectionsEditor from "../components/SectionsEditor";
import BrollEditor from "../components/BrollEditor";
import AssetsEditor from "../components/AssetsEditor";

export default async function IdeaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [idea, sections, broll, assets, suggestions] = await Promise.all([
    getIdea(id),
    getSections(id),
    getBroll(id),
    getAssets(id),
    listAllTags(),
  ]);

  if (!idea) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/tools/content"
          className="text-sm text-[#8da2c0] hover:text-[#e8f0fe]"
        >
          ← All ideas
        </Link>
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#8da2c0]">
          {new Date(idea.updated_at).toLocaleString()}
        </span>
      </div>

      <IdeaEditor idea={idea} suggestions={suggestions} />

      {idea.format === "video" ? (
        <SectionsEditor ideaId={idea.id} sections={sections} />
      ) : null}

      <BrollEditor ideaId={idea.id} items={broll} />

      <AssetsEditor ideaId={idea.id} format={idea.format} items={assets} />
    </div>
  );
}
