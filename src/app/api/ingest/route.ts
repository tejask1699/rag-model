import { NextResponse } from 'next/server';
import { storeDocuments } from '@/lib/documents';
import { extractTextFromFile } from '@/lib/parser';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const textInput = formData.get('text') as string | null;

    let textToStore = "";

    if (file) {
      textToStore = await extractTextFromFile(file);
    } else if (textInput) {
      textToStore = textInput;
    } else {
      return NextResponse.json({ error: "File or text is required" }, { status: 400 });
    }

    if (!textToStore.trim()) {
      return NextResponse.json({ error: "Extracted text is empty" }, { status: 400 });
    }

    await storeDocuments(textToStore);
    
    return NextResponse.json({ 
      message: "Documents stored successfully",
      extractedLength: textToStore.length 
    });
  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to store documents" 
    }, { status: 500 });
  }
}

