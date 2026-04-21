const { Pool } = require('pg');

const pool = new Pool({
  connectionString: "",
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
