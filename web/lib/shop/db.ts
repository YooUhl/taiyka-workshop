import "server-only";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __shopPgPool: Pool | undefined;
}

export class ShopDbNotConfigured extends Error {
  constructor() {
    super("BOOK_DATABASE_URL is not set");
    this.name = "ShopDbNotConfigured";
  }
}

function makePool(): Pool {
  // Shop shares the dedicated lead-capture Supabase project with /book.
  // Same env var, different schema (shop.waitlist vs book.qualifications).
  const connectionString = process.env.BOOK_DATABASE_URL;
  if (!connectionString) {
    throw new ShopDbNotConfigured();
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

// Pool is process-scoped — cache across hot requests in any environment.
// Vercel cold start still pays the first-connection cost (~200-500ms).
function getPool(): Pool {
  if (global.__shopPgPool) return global.__shopPgPool;
  global.__shopPgPool = makePool();
  return global.__shopPgPool;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
