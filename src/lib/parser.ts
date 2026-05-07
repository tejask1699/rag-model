import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import path from 'path';
import { pathToFileURL } from 'url';

// Node.js ESM loader only supports file: and data: URLs, so we must
// point to the local worker file rather than a CDN URL.
const workerPath = path.join(process.cwd(), 'node_modules/pdf-parse/dist/worker/pdf.worker.mjs');
PDFParse.setWorker(pathToFileURL(workerPath).href);

export async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (file.type === 'application/pdf') {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text;
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name.endsWith('.docx')
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    return new TextDecoder().decode(arrayBuffer);
  } else {
    throw new Error('Unsupported file type: ' + file.type);
  }
}
