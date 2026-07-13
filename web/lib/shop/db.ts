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

function getPool(): Pool {
  if (global.__shopPgPool) return global.__shopPgPool;
  const p = makePool();
  if (process.env.NODE_ENV !== "production") {
    global.__shopPgPool = p;
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
