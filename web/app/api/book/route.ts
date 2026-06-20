import "server-only";
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  isValidEmail,
  NAME_MAX,
  NAME_MIN,
  LOCATION_MAX,
  LOCATION_MIN,
  PROJECT_DESCRIPTION_MAX,
  PROJECT_DESCRIPTION_MIN,
  PROJECT_TYPE_KEYS,
  ROLE_KEYS,
  type ProjectTypeKey,
  type RoleKey,
} from "@/lib/book/content";
import { checkRateLimit } from "@/lib/book/rate-limit";

export const runtime = "nodejs";

type Body = {
  lang?: string;
  role?: string;
  projectType?: string;
  projectDescription?: string;
  name?: string;
  email?: string;
  location?: string;
};

type Issue = { field: string; message: string };

function lenInRange(s: string, min: number, max: number) {
  const len = s.length;
  return len >= min && len <= max;
}

function isRoleKey(v: string): v is RoleKey {
  return (ROLE_KEYS as readonly string[]).includes(v);
}
function isProjectTypeKey(v: string): v is ProjectTypeKey {
  return (PROJECT_TYPE_KEYS as readonly string[]).includes(v);
}

type ValidatedBody = {
  lang: "fr" | "en";
  role: RoleKey;
  projectType: ProjectTypeKey;
  projectDescription: string;
  name: string;
  email: string;
  location: string;
};
function validate(body: Body): { ok: true; data: ValidatedBody } | { ok: false; issues: Issue[] } {
  const issues: Issue[] = [];

  const lang = body.lang === "en" ? "en" : "fr";

  const roleRaw = (body.role ?? "").trim();
  if (!isRoleKey(roleRaw)) {
    issues.push({ field: "role", message: "Invalid role." });
  }
  const role = roleRaw as RoleKey;

  const projectTypeRaw = (body.projectType ?? "").trim();
  if (!isProjectTypeKey(projectTypeRaw)) {
    issues.push({ field: "projectType", message: "Invalid project type." });
  }
  const projectType = projectTypeRaw as ProjectTypeKey;

  const projectDescription = (body.projectDescription ?? "").trim();
  if (!lenInRange(projectDescription, PROJECT_DESCRIPTION_MIN, PROJECT_DESCRIPTION_MAX)) {
    issues.push({
      field: "projectDescription",
      message: `Must be ${PROJECT_DESCRIPTION_MIN}-${PROJECT_DESCRIPTION_MAX} characters.`,
    });
  }

  const name = (body.name ?? "").trim();
  if (!lenInRange(name, NAME_MIN, NAME_MAX)) {
    issues.push({ field: "name", message: `Must be ${NAME_MIN}-${NAME_MAX} characters.` });
  }

  const email = (body.email ?? "").trim();
  if (!isValidEmail(email)) {
    issues.push({ field: "email", message: "Invalid email." });
  }

  const location = (body.location ?? "").trim();
  if (!lenInRange(location, LOCATION_MIN, LOCATION_MAX)) {
    issues.push({
      field: "location",
      message: `Must be ${LOCATION_MIN}-${LOCATION_MAX} characters.`,
    });
  }

  if (issues.length > 0) return { ok: false, issues };

  return {
    ok: true,
    data: {
      lang,
      role,
      projectType,
      projectDescription,
      name,
      email,
      location,
    },
  };
}

function getCalendlyUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_CALENDLY_BOOK_URL?.trim();
  return base && base.length > 0 ? base : null;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: result.issues },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent")?.slice(0, 255) ?? null;

  try {
    await query(
      `insert into book.qualifications
         (lang, role, project_type, project_description, name, email, location, user_agent)
       values ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        result.data.lang,
        result.data.role,
        result.data.projectType,
        result.data.projectDescription,
        result.data.name,
        result.data.email,
        result.data.location,
        userAgent,
      ],
    );
  } catch (err) {
    console.error("[/api/book] insert failed", {
      code: (err as { code?: string })?.code,
      message: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { ok: false, error: "Database insert failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    calendlyUrl: getCalendlyUrl(),
  });
}
