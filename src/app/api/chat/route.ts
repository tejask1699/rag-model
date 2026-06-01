import { retrieveDocuments } from "@/lib/retrieval";
import { generateAnswer } from "@/lib/llm";

function getErrorResponse(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      status?: number;
      code?: string;
      error?: { message?: string };
      message?: string;
    };

    return {
      status: typeof maybeError.status === "number" ? maybeError.status : 500,
      message:
        maybeError.error?.message ||
        maybeError.message ||
        "An unexpected error occurred",
      code: maybeError.code || "internal_error",
    };
  }

  return {
    status: 500,
    message: "An unexpected error occurred",
    code: "internal_error",
  };
}

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    const docs = await retrieveDocuments(query);
    const answer = await generateAnswer(query, docs);

    return Response.json({ answer });
  } catch (error: unknown) {
    console.error("Chat API Error:", error);
    const { status, message, code } = getErrorResponse(error);

    return Response.json(
      { error: message, code },
      { status }
    );
  }
}
