import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(
    apiKey
);

export async function getEmbeddings(text: string) {
    const model = genAI.getGenerativeModel(
        { model: "models/gemini-embedding-001" },
        { apiVersion: "v1beta" }
    );

    const result = await model.embedContent(text);

    return result.embedding.values;
}
