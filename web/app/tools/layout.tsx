import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  robots: { index: false, follow: false },
};

export default function ToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-dvh bg-[#0a1628] text-[#e8f0fe]">
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        {children}
      </main>
    </div>
  );
}
