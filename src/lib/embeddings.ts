import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
})


export async function getEmbeddings(text: string) {
    const res = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text
    })

    return res.data[0].embedding
}