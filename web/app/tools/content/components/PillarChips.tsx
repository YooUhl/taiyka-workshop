"use client";

import Chip from "./Chip";
import { PILLARS, PILLAR_LABELS, type Pillar } from "@/lib/content/pillars";

type Props = {
  value: Pillar | null;
  onChange: (next: Pillar | null) => void;
};

export default function PillarChips({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PILLARS.map((p) => (
        <Chip
          key={p}
          active={value === p}
          onClick={() => onChange(value === p ? null : p)}
        >
          {PILLAR_LABELS[p]}
        </Chip>
      ))}
    </div>
  );
}
