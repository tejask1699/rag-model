import { pool } from "./db";
import { getEmbeddings } from "./embeddings";


export async function retrieveDocuments(query: string) {
    const embedding = await getEmbeddings(query);
    // Convert array -> pgvector format
    const vectorString = `[${embedding.join(",")}]`;
    const result = await pool.query(
        `SELECT content
        FROM documents
        ORDER BY embedding <-> $1::vector
        LIMIT 5
        `,
        [vectorString]
    )
    return result.rows.map((row) => row.content);

}