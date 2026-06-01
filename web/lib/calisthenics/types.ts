export type Category =
  | "push"
  | "pull"
  | "core"
  | "legs"
  | "static"
  | "dynamic";

export const CATEGORIES: readonly Category[] = [
  "push",
  "pull",
  "core",
  "legs",
  "static",
  "dynamic",
] as const;

export type ProgressStatus =
  | "locked"
  | "unlocked"
  | "practicing"
  | "mastered";

export type MasteryConditionType =
  | "hold_seconds"
  | "reps"
  | "form"
  | "custom";

export type MasteryCondition = {
  type: MasteryConditionType;
  value: number | string;
  label: string;
};

export type Attempt = {
  date: string; // ISO yyyy-mm-dd
  condition_key: string; // matches MasteryCondition.label (poor-man key)
  value: number | string;
  met: boolean;
};

export type Skill = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  tier: number; // 1..10
  description: string;
  prerequisites: string[]; // array of skill slugs
  mastery_conditions: MasteryCondition[];
  created_at: string;
};

export type Progress = {
  id: string;
  skill_id: string;
  status: ProgressStatus;
  notes: string;
  mastered_at: string | null;
  attempts: Attempt[];
  updated_at: string;
};

export type SkillWithProgress = Skill & {
  progress: Progress | null;
  effective_status: ProgressStatus;
};
