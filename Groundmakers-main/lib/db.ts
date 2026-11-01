import { neon } from "@neondatabase/serverless";

/** Neon Postgres client. Created on first use so builds don't need DATABASE_URL. */
let client: ReturnType<typeof neon> | undefined;

export function getSql() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}
