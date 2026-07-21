import "server-only";
import { NextResponse } from "next/server";
import {
  BookDbNotConfigured,
  PG_UNIQUE_VIOLATION,
  isTransientDbError,
  query,
} from "@/lib/book/db";
import {
  EMAIL_MAX,
  EMAIL_MIN,
  hasLetterChar,
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

// nodejs runtime required — pg has Node-only native bindings, won't run on edge.
export const runtime = "nodejs";

const MAX_BODY_BYTES = 16_384; // 16KB — well over the schema, kills 50MB DOS

const ALLOWED_ORIGINS = new Set([
  "https://taiyka.com",
  "https://www.taiyka.com",
  "https://taiyka-workshop.vercel.app",
  "https://taiyka-qcm.vercel.app",
  "https://workshop.taiyka.com",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
]);

type Body = {
  lang?: string;
  role?: string;
  projectType?: string;
  projectDescription?: string;
  name?: string;
  email?: string;
  location?: string;
  // Honeypot field — real users never see it; bots fill everything.
  company_website?: string;
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

  const roleRaw = typeof body.role === "string" ? body.role.trim() : "";
  if (!isRoleKey(roleRaw)) {
    issues.push({ field: "role", message: "Invalid role." });
  }
  const role = roleRaw as RoleKey;

  const projectTypeRaw = typeof body.projectType === "string" ? body.projectType.trim() : "";
  if (!isProjectTypeKey(projectTypeRaw)) {
    issues.push({ field: "projectType", message: "Invalid project type." });
  }
  const projectType = projectTypeRaw as ProjectTypeKey;

  const projectDescription = typeof body.projectDescription === "string"
    ? body.projectDescription.trim()
    : "";
  if (!lenInRange(projectDescription, PROJECT_DESCRIPTION_MIN, PROJECT_DESCRIPTION_MAX)) {
    issues.push({
      field: "projectDescription",
      message: `Must be ${PROJECT_DESCRIPTION_MIN}-${PROJECT_DESCRIPTION_MAX} characters.`,
    });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!lenInRange(name, NAME_MIN, NAME_MAX) || !hasLetterChar(name)) {
    issues.push({ field: "name", message: `Must be ${NAME_MIN}-${NAME_MAX} characters with at least one letter.` });
  }

  // Email — length cap BEFORE regex to avoid CPU burn on huge inputs.
  const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (emailRaw.length < EMAIL_MIN || emailRaw.length > EMAIL_MAX) {
    issues.push({ field: "email", message: `Must be ${EMAIL_MIN}-${EMAIL_MAX} characters.` });
  } else if (!isValidEmail(emailRaw)) {
    issues.push({ field: "email", message: "Invalid email." });
  }

  const location = typeof body.location === "string" ? body.location.trim() : "";
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
      email: emailRaw,
      location,
    },
  };
}

function getCalendlyUrl(): string | null {
  const base = process.env.NEXT_PUBLIC_CALENDLY_BOOK_URL?.trim();
  return base && base.length > 0 ? base : null;
}

// Vercel injects the real client IP as the LAST entry of x-forwarded-for
// AND mirrors it in x-vercel-forwarded-for. Prefer the Vercel-specific
// header — it can't be spoofed because Vercel rewrites it at the edge.
function getClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for");
  if (vercel) return vercel.split(",").map((s) => s.trim()).filter(Boolean).pop() ?? "unknown";
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim() || "unknown";
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    // Read LAST entry — first entries can be client-injected spoofs.
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    return parts.pop() ?? "unknown";
  }
  return "unknown";
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get("origin");
  // Same-origin POSTs from the page can omit Origin (browser-dependent).
  // Allow only missing Origin (server-to-server is fine here) OR allowlist hit.
  if (!origin) return true;
  return ALLOWED_ORIGINS.has(origin);
}

export async function POST(request: Request) {
  if (!originAllowed(request)) {
    return NextResponse.json({ ok: false, error: "Origin not allowed." }, { status: 403 });
  }

  // Body size cap — read raw text first, reject early if too large.
  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }
  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ ok: false, error: "Could not read body." }, { status: 400 });
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large." }, { status: 413 });
  }

  const ip = getClientIp(request);
  const limit = checkRateLimit(ip, "book");
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 60) } },
    );
  }

  let body: Body;
  try {
    body = JSON.parse(rawBody) as Body;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  // Honeypot — silently 200 to confuse bots, don't log identifying info.
  if (typeof body.company_website === "string" && body.company_website.length > 0) {
    return NextResponse.json({ ok: true, calendlyUrl: getCalendlyUrl() });
  }

  const result = validate(body);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: result.issues },
      { status: 400 },
    );
  }

  const userAgent = request.headers.get("user-agent") ?? null;
  const calendlyUrl = getCalendlyUrl();

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
    if (err instanceof BookDbNotConfigured) {
      // Calendly path still works without the DB — user can book, Manu just
      // loses the qualification record. Better to lose the record than block
      // the booking entirely.
      if (calendlyUrl) {
        console.warn("[/api/book] BOOK_DATABASE_URL missing — booking proceeds without qualification log");
        return NextResponse.json({ ok: true, calendlyUrl });
      }
      return NextResponse.json(
        { ok: false, error: "Booking backend not yet configured." },
        { status: 503 },
      );
    }

    const code = (err as { code?: string })?.code;

    // Duplicate qualification → benign. Treat as success so returning users
    // can rebook without hitting a confusing 500.
    if (code === PG_UNIQUE_VIOLATION) {
      return NextResponse.json({ ok: true, calendlyUrl });
    }

    // Transient → 503 (retry-safe). Caller's rate-limit slot already consumed
    // but we surface a recoverable status so the UI can retry intelligently.
    if (isTransientDbError(err)) {
      console.warn("[/api/book] transient db error", { code });
      return NextResponse.json(
        { ok: false, error: "Service temporarily unavailable." },
        { status: 503, headers: { "Retry-After": "10" } },
      );
    }

    // Log SQLSTATE only — never the raw pg message (echoes PII via DETAIL).
    console.error("[/api/book] insert failed", { code });
    return NextResponse.json(
      { ok: false, error: "Database insert failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    calendlyUrl,
  });
}

export async function HEAD() {
  // Lightweight liveness — returns 200 if pool can be acquired, 503 otherwise.
  try {
    await query("select 1");
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 503 });
  }
}
