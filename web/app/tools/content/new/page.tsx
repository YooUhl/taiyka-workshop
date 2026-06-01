import NewIdeaForm from "../components/NewIdeaForm";

export default function NewIdeaPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#00a6ff]">
          Content · New
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight md:text-3xl">
          New idea
        </h1>
        <p className="mt-2 text-sm text-[#8da2c0]">
          Capture title + platforms + format. Everything else can be filled on the detail page.
        </p>
      </div>
      <NewIdeaForm />
    </div>
  );
}
