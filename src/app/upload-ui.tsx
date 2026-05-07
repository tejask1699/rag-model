"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";

export default function UploadUI() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setStatus({ 
        type: "success", 
        message: `Successfully ingested: ${file.name} (${data.extractedLength} characters)` 
      });
      setFile(null);
    } catch (err: any) {
      console.error("Upload error:", err);
      setStatus({ type: "error", message: err.message || "Failed to upload file" });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setStatus(null);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center">
          <Upload className="text-indigo-400 w-5 h-5" />
        </div>
        <h2 className="text-lg font-semibold text-zinc-100">Ingest Knowledge</h2>
      </div>

      {!file ? (
        <label className="group relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            <p className="mb-1 text-sm text-zinc-400 font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-zinc-500">PDF, DOCX or TXT</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative p-4 rounded-2xl bg-zinc-800/50 border border-white/5 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="text-white w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">{file.name}</p>
              <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button 
              onClick={clearFile}
              className="p-2 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-4 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ingesting...
              </>
            ) : (
              "Process Document"
            )}
          </button>
        </div>
      )}

      {status && (
        <div className={`mt-4 p-4 rounded-2xl border flex gap-3 animate-in fade-in slide-in-from-top-2 ${
          status.type === "success" 
            ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" 
            : "bg-red-500/5 border-red-500/20 text-red-400"
        }`}>
          {status.type === "success" ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <p className="text-sm font-medium leading-relaxed">{status.message}</p>
        </div>
      )}
    </div>
  );
}
