export type TrustItem = {
  label: string;
  detail: string;
};

/**
 * Three-up reassurance row. Flush cells divided by hairlines — the topg
 * treatment, not three floating cards.
 */
export function TrustStrip({ items }: { items: TrustItem[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-px bg-border border-y border-border sm:grid-cols-3">
      {items.map((item) => (
        <li key={item.label} className="bg-background px-6 py-7 text-center">
          <p className="font-mono-hud text-[11px] tracking-[0.18em] uppercase text-primary mb-2">
            {item.label}
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-snug">
            {item.detail}
          </p>
        </li>
      ))}
    </ul>
  );
}
