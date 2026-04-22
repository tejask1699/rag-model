import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { storeDocuments } from "../lib/documents";
import { pool } from "../lib/db";

async function main() {
  console.log("Testing storeDocuments...");
  const sampleText = "This is a sample document for testing the RAG model storage. It should be chunked and embedded properly.";

  try {
    await storeDocuments(sampleText);
    console.log("Documents stored successfully.");
    
    const res = await pool.query("SELECT * FROM documents ORDER BY content DESC LIMIT 1");
    console.log("Verification from DB:", res.rows[0]);
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await pool.end();
  }
}

main();
