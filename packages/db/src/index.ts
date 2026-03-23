import { env } from "@book-review-platform/env/server";
import { type NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema,
});
