import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function makePool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

// Lazy: build-time page-data collection imports this module without ever calling
// query(), so we must not throw at module load. Pool created on first call.
// Pool is process-scoped — cache across hot requests in any environment.
// Vercel cold start still pays the first-connection cost (~200-500ms).
function getPool(): Pool {
  if (global.__pgPool) return global.__pgPool;
  global.__pgPool = makePool();
  return global.__pgPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
