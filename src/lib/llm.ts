import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
})

export async function generateAnswer(query: string, context: string[]) {
    const prompt = `
You are a helpful assistant.

Context:
${context.join("\n")}

Question:
${query}
`;

    const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
    });

    return res.choices[0].message.content;
} 