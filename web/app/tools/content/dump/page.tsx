import Link from "next/link";
import BrainDumpForm from "../components/BrainDumpForm";

export default function BrainDumpPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00a6ff]">
          Content · Brain dump
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight md:text-3xl">
          Brain dump
        </h1>
        <p className="mt-2 text-sm text-[#8da2c0]">
          One idea per line. Defaults apply to every line. All are saved as
          drafts.
        </p>
      </div>
      <BrainDumpForm />
      <div>
        <Link
          href="/tools/content"
          className="text-xs text-[#8da2c0] hover:text-[#e8f0fe]"
        >
          ← All ideas
        </Link>
      </div>
    </div>
  );
}
