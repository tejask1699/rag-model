import { pool } from "./db";
import { v4 as uuidv4 } from "uuid";
import { getEmbeddings } from "./embeddings";

/**
 * Basic text chunking function.
 * Splits text into chunks of approximately maxChunkSize characters.
 */
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let endPos = currentPos + maxChunkSize;
    if (endPos < text.length) {
      // Try to find a space to split at
      const lastSpace = text.lastIndexOf(" ", endPos);
      if (lastSpace > currentPos) {
        endPos = lastSpace;
      }
    }
    chunks.push(text.slice(currentPos, endPos).trim());
    currentPos = endPos;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

export async function storeDocuments(text: string) {
  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await getEmbeddings(chunk);

    const vectorString = `[${embedding.join(",")}]`;

    await pool.query(
      `INSERT INTO documents (id, content, embedding)
       VALUES ($1, $2, $3)`,
      [uuidv4(), chunk, vectorString]
    );
  }
}
