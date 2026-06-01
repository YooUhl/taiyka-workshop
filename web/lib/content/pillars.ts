export const PILLARS = [
  "ai-tools",
  "automation-tips",
  "behind-the-scenes",
  "client-wins",
  "personal",
  "education",
] as const;
export type Pillar = (typeof PILLARS)[number];

export const PILLAR_LABELS: Record<Pillar, string> = {
  "ai-tools": "AI tools",
  "automation-tips": "Automation tips",
  "behind-the-scenes": "Behind the scenes",
  "client-wins": "Client wins",
  personal: "Personal",
  education: "Education",
};

export function isPillar(v: string): v is Pillar {
  return (PILLARS as readonly string[]).includes(v);
}

export function pillarLabel(v: string | null | undefined): string | null {
  if (!v) return null;
  return isPillar(v) ? PILLAR_LABELS[v] : v;
}
