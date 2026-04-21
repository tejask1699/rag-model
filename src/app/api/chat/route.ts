import { retrieveDocuments } from "@/lib/retrieval";
import { generateAnswer } from "@/lib/llm";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const docs = await retrieveDocuments(query);
    const answer = await generateAnswer(query, docs);

    return Response.json({ answer });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    
    const status = error.status || 500;
    const message = error.error?.message || "An unexpected error occurred";
    const code = error.code || "internal_error";

    return Response.json(
      { error: message, code: code },
      { status: status }
    );
  }
}