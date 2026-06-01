export const PLATFORMS = ["ig", "tiktok", "facebook", "linkedin"] as const;
export type Platform = (typeof PLATFORMS)[number];

export const FORMATS = ["video", "carousel", "image", "story"] as const;
export type Format = (typeof FORMATS)[number];

export const STATUSES = [
  "draft",
  "scripted",
  "in-production",
  "edited",
  "ready",
  "published",
  "archived",
] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SORTS = [
  "updated_desc",
  "scheduled_asc",
  "priority_desc",
  "created_desc",
] as const;
export type Sort = (typeof SORTS)[number];

export const SECTION_TYPES = ["hook", "body", "cta"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export const ASSET_KINDS = ["image_idea", "carousel_slide", "story_frame"] as const;
export type AssetKind = (typeof ASSET_KINDS)[number];

export type Idea = {
  id: string;
  title: string;
  platform: Platform[];
  format: Format;
  status: Status;
  notes: string;
  tags: string[];
  pillar: string | null;
  scheduled_for: string | null;
  priority: Priority;
  inspiration_url: string | null;
  created_at: string;
  updated_at: string;
};

export type VideoSection = {
  id: string;
  idea_id: string;
  section_type: SectionType;
  content: string;
  order_idx: number;
};

export type BrollIdea = {
  id: string;
  idea_id: string;
  description: string;
  ref_url: string | null;
};

export type Asset = {
  id: string;
  idea_id: string;
  kind: AssetKind;
  description: string;
  order_idx: number;
};

export type IdeaFilters = {
  q?: string;
  platform?: Platform;
  format?: Format;
  status?: Status;
  pillar?: string;
  priority?: Priority;
  tag?: string;
  scheduledFrom?: string;
  scheduledTo?: string;
  sort?: Sort;
};
