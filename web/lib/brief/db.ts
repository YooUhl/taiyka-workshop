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

function makePool(): Pool {
  // Le Brief shares the dedicated lead-capture Supabase project with /book and
  // /shop. Same env var (BOOK_DATABASE_URL), different schema (brief.*).
  const connectionString = process.env.BOOK_DATABASE_URL;
  if (!connectionString) {
    throw new BriefDbNotConfigured();
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

function getPool(): Pool {
  if (global.__briefPgPool) return global.__briefPgPool;
  const p = makePool();
  if (process.env.NODE_ENV !== "production") {
    global.__briefPgPool = p;
  }
  return p;
}

export async function query<T = unknown>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await getPool().query(text, params);
  return res.rows as T[];
}
