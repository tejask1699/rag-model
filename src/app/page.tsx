import ChatUI from "./chat-ui";
import UploadUI from "./upload-ui";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] from-zinc-900 via-zinc-950 to-black overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar for Upload */}
      <aside className="w-full md:w-80 lg:w-96 p-4 md:p-6 border-b md:border-b-0 md:border-r border-white/5 flex flex-col gap-6">
        <div className="flex flex-col gap-1 px-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Knowledge Base</h1>
          <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest">Ingest your data</p>
        </div>
        <UploadUI />
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 h-[60vh] md:h-screen">
        <ChatUI />
      </section>
    </main>
  );
}

