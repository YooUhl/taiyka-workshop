import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __bookPgPool: Pool | undefined;
}

export class BookDbNotConfigured extends Error {
  constructor() {
    super("BOOK_DATABASE_URL is not set");
    this.name = "BookDbNotConfigured";
  }
}

// Postgres SQLSTATE codes we surface to handlers.
export const PG_UNIQUE_VIOLATION = "23505";

const TRANSIENT_CODES = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "57P01", // admin_shutdown
  "57P02", // crash_shutdown
  "57P03", // cannot_connect_now
  "08000", // connection_exception
  "08003", // connection_does_not_exist
  "08006", // connection_failure
  "08001", // sqlclient_unable_to_establish_sqlconnection
  "08004", // sqlserver_rejected_establishment_of_sqlconnection
]);

export function isTransientDbError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false;
  const code = (err as { code?: string }).code;
  return typeof code === "string" && TRANSIENT_CODES.has(code);
}

function makePool(): Pool {
  const connectionString = process.env.BOOK_DATABASE_URL;
  if (!connectionString) {
    throw new BookDbNotConfigured();
  }
  // Supabase pooler presents Amazon RDS certificate chain. We accept the
  // pooler's TLS without local CA bundle — MITM mitigated by the dedicated
  // VPC peering between Vercel and Supabase. Tracked as P1-5 in
  // AUDIT-BOOK-V3.md: pin the CA bundle once Supabase exposes a stable URL
  // for it (current dashboard link rotates).
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });
}

// Pool is process-scoped — cache across hot requests in any environment.
// Vercel cold start still pays the first-connection cost (~200-500ms).
function getPool(): Pool {
  if (global.__bookPgPool) return global.__bookPgPool;
  global.__bookPgPool = makePool();
  return global.__bookPgPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
