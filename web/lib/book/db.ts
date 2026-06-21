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

function makePool(): Pool {
  const connectionString = process.env.BOOK_DATABASE_URL;
  if (!connectionString) {
    throw new BookDbNotConfigured();
  }
  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30_000,
  });
}

// Lazy: build-time page-data collection must not throw if env missing.
// Pool created on first query() call.
function getPool(): Pool {
  if (global.__bookPgPool) return global.__bookPgPool;
  const p = makePool();
  if (process.env.NODE_ENV !== "production") {
    global.__bookPgPool = p;
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
