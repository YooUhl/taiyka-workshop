import {
  Target,
  Sparkles,
  Settings,
  Package,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Target,
  Sparkles,
  Settings,
};

export function resolveIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Package;
}
