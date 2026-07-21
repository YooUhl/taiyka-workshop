import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __briefPgPool: Pool | undefined;
}

export class BriefDbNotConfigured extends Error {
  constructor() {
    super("BOOK_DATABASE_URL is not set");
    this.name = "BriefDbNotConfigured";
  }
}

/**
 * TLS config for the Supabase pooler. When BRIEF_DB_CA_CERT holds the project's
 * CA cert (Supabase dashboard → Settings → Database → SSL), we verify the chain
 * (verify-full). Without it we still encrypt but can't verify — the pooler
 * presents a self-signed cert, so plain rejectUnauthorized:true would fail.
 * Set the env var to close the MITM gap (P1-10).
 */
function sslConfig(): { rejectUnauthorized: boolean; ca?: string } {
  const ca = process.env.BRIEF_DB_CA_CERT?.trim();
  if (ca) {
    return { ca, rejectUnauthorized: true };
  }
  return { rejectUnauthorized: false };
}

function makePool(): Pool {
  // Le Brief shares the dedicated lead-capture Supabase project with /book and
  // /shop. Same env var (BOOK_DATABASE_URL), different schema (brief.*).
  const connectionString = process.env.BOOK_DATABASE_URL;
  if (!connectionString) {
    throw new BriefDbNotConfigured();
  }
  return new Pool({
    connectionString,
    ssl: sslConfig(),
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

// Pool is process-scoped — cache across hot requests in any environment.
// Vercel cold start still pays the first-connection cost (~200-500ms).
function getPool(): Pool {
  if (global.__briefPgPool) return global.__briefPgPool;
  global.__briefPgPool = makePool();
  return global.__briefPgPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
