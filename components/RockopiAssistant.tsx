// components/RockopiAssistant.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2 } from "lucide-react";
import { askRockopiAI } from "@/app/actions/ai";

type Message = {
  role: "user" | "ai";
  content: string;
};

export default function RockopiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "Halo Bos! Ada yang bisa saya bantu hitung atau cari tahu hari ini?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    // Panggil Server Action ke Google Gemini
    const response = await askRockopiAI(userMsg);

    setMessages((prev) => [
      ...prev,
      { role: "ai", content: response.text || "Terjadi kesalahan." },
    ]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Tombol Melayang (Floating Action Button) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:bg-green-400 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center ${isOpen ? "opacity-0 pointer-events-none scale-50" : "opacity-100 scale-100"}`}
      >
        <Bot size={28} />
      </button>

      {/* Jendela Chat AI (Dark Glassmorphism) */}
      <div
        className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-sm h-[500px] max-h-[80vh] flex flex-col bg-[#07110a]/95 backdrop-blur-2xl border border-green-400/30 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 origin-bottom-right ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"}`}
      >
        {/* Header Jendela */}
        <div className="p-4 bg-green-500/10 border-b border-green-400/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-400">
            <Sparkles size={18} />
            <h3 className="font-black tracking-wide text-sm">
              Rockopi AI Core
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/50 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition-colors active:scale-90"
          >
            <X size={18} />
          </button>
        </div>

        {/* Area Pesan */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === "user" ? "bg-white/10 text-white rounded-br-sm" : "bg-green-500/10 border border-green-400/20 text-green-50 rounded-bl-sm"}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-green-500/10 border border-green-400/20 text-green-400 p-3 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />{" "}
                <span className="text-xs font-bold">Sedang berpikir...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Area Input Box */}
        <div className="p-3 border-t border-white/10 bg-black/40">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya apa saja..."
              className="flex-1 bg-white/5 text-white text-sm px-4 py-3 rounded-xl border border-white/10 focus:border-green-400 outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-500 text-black px-4 rounded-xl hover:bg-green-400 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
