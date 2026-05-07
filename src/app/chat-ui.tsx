"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, AlertCircle, RefreshCcw } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatUI() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; code?: string } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAsk = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw { 
          message: data.error || "Failed to get response", 
          code: data.code 
        };
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setError({
        message: err.message || "An unexpected error occurred. Please try again.",
        code: err.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 bg-transparent text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">RAG Assistant</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Powered by Vector Search</p>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto mb-6 space-y-6 pr-2 scrollbar-thin scrollbar-thumb-white/10"
      >
        {messages.length === 0 && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
            <Bot className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">How can I help you today?</p>
            <p className="text-sm">Ask anything about the provided documents.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              msg.role === "user" ? "bg-indigo-600" : "bg-zinc-800 border border-white/5"
            }`}>
              {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-blue-400" />}
            </div>
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-500/10" 
                : "bg-zinc-900 border border-white/5 text-zinc-100 rounded-tl-none"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
              <Bot className="w-5 h-5 text-blue-400" />
            </div>
            <div className="bg-zinc-900 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none">
              <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/20 text-center animate-in fade-in slide-in-from-bottom-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-red-500">Service Interruption</h3>
              <p className="text-sm text-red-400/80 max-w-xs">
                {error.code === "insufficient_quota" 
                  ? "OpenAI quota exceeded. Please check your billing or plan details."
                  : error.message}
              </p>
            </div>
            <button 
              onClick={() => handleAsk()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium transition-colors"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleAsk}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to from-blue-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center bg-zinc-900 border border-white/10 rounded-2xl p-2 pr-3 shadow-2xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm placeholder:text-zinc-500 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className="p-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-50 disabled:bg-zinc-800 transition-all hover:bg-blue-500 active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-3 text-center text-[10px] text-zinc-500 font-medium">
          Note: This system uses vector retrieval to enhance answers.
        </p>
      </form>
    </div>
  );
}
