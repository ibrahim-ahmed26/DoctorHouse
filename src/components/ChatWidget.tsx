"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatWidget() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? data.error ?? "Sorry, something went wrong." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setSending(false);
    }
  }

  const isAr = locale === "ar";

  return (
    <div style={{ position: "fixed", bottom: 20, insetInlineEnd: 20, zIndex: 50, direction: isAr ? "rtl" : "ltr" }}>
      {open && (
        <div style={{
          width: 320, height: 420, background: "#fff", border: "1px solid #e2e8e5", borderRadius: 14,
          boxShadow: "0 12px 32px rgba(0,0,0,.18)", display: "flex", flexDirection: "column", marginBottom: 12, overflow: "hidden",
        }}>
          <div style={{ padding: "12px 16px", background: "#0f2e2b", color: "#fff", fontWeight: 700, fontSize: 14 }}>
            {isAr ? "اسأل عن الرعاية المنزلية" : "Ask about home care"}
          </div>
          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
            {messages.length === 0 && (
              <p style={{ color: "#888", fontSize: 13 }}>
                {isAr ? "اسألني عن الخدمات أو كيفية الحجز." : "Ask me about our services or how to book."}
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                background: m.role === "user" ? "#0f2e2b" : "#dbe7e2",
                color: m.role === "user" ? "#fff" : "#0f2e2b",
                padding: "8px 12px", borderRadius: 10, maxWidth: "85%", fontSize: 14,
              }}>
                {m.content}
              </div>
            ))}
            {sending && <div style={{ color: "#888", fontSize: 13 }}>{isAr ? "يكتب..." : "Typing..."}</div>}
          </div>
          <div style={{ display: "flex", borderTop: "1px solid #e2e8e5" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={isAr ? "اكتب سؤالك..." : "Type your question..."}
              style={{ flex: 1, border: 0, padding: 12, fontSize: 14, outline: "none" }}
            />
            <button onClick={send} disabled={sending} style={{ border: 0, background: "#b8975a", padding: "0 16px", fontWeight: 700, cursor: "pointer" }}>
              {isAr ? "إرسال" : "Send"}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        style={{
          width: 56, height: 56, borderRadius: "50%", background: "#0f2e2b", color: "#fff",
          border: 0, fontSize: 22, cursor: "pointer", boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        }}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
