import dotenv  from "dotenv";
dotenv.config({ path: ".env.local" });

import { pool } from "../lib/db";

async function main() {
  try {
    const res = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'documents'");
    console.log("Table 'documents' schema:");
    console.table(res.rows);
  } catch (error) {
    console.error("Error checking schema:", error);
  } finally {
    await pool.end();
  }
}

main();
