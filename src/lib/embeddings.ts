import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_GEMINI_API_KEY) {
    console.error("NEXT_GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(
    process.env.NEXT_GEMINI_API_KEY || ""
);

export async function getEmbeddings(text: string) {
    const model = genAI.getGenerativeModel(
        { model: "models/gemini-embedding-001" },
        { apiVersion: "v1beta" }
    );

    const result = await model.embedContent(text);

    return result.embedding.values;
}