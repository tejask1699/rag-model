import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? process.env.NEXT_GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAnswer(query: string, context: string[]) {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" }, { apiVersion: "v1beta" });

    const prompt = `
You are a helpful assistant.

Context:
${context.join("\n")}

Question:
${query}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
 
