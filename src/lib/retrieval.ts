import { pool } from "./db";
import { getEmbeddings } from "./embeddings";


export async function retrieveDocuments(query: string) {
    const embedding = await getEmbeddings(query);

    const result = await pool.query(
        `SELECT content
        FROM documents
        ORDER BY embedding <-> $1::vector
        LIMIT 5
        `,
        [embedding]
    )
    return result.rows.map((row) => row.content);

}