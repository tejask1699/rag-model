import { NextResponse } from 'next/server';
import { storeDocuments } from '@/lib/documents';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    await storeDocuments(text);
    
    return NextResponse.json({ message: "Documents stored successfully" });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ error: "Failed to store documents" }, { status: 500 });
  }
}
