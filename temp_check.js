/* eslint-disable @typescript-eslint/no-require-imports */
const { loadEnvConfig } = require("@next/env");
const { Pool } = require("pg");

loadEnvConfig(process.cwd());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? process.env.NEXT_PUBLIC_DATABASE_URL,
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'documents' AND column_name = 'embedding';
    `);
    console.log(JSON.stringify(res.rows, null, 2));

    const dimRes = await pool.query(`
      SELECT atttypmod
      FROM pg_attribute
      WHERE attrelid = 'documents'::regclass AND attname = 'embedding';
    `);
    console.log("Dimension (atttypmod - 4):", dimRes.rows[0].atttypmod - 4);

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

checkSchema();
