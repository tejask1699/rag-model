import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

export const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
})
