"use client";

import Chip from "./Chip";
import { PRIORITIES, type Priority } from "@/lib/content/types";

type Props = {
  value: Priority;
  onChange: (next: Priority) => void;
};

export default function PriorityChips({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRIORITIES.map((p) => (
        <Chip key={p} active={value === p} onClick={() => onChange(p)}>
          {p}
        </Chip>
      ))}
    </div>
  );
}
