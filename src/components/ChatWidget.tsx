"use client";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

type Msg = { role: "user" | "assistant"; content: string; kind?: "busy" };

export default function ChatWidget() {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const isAr = locale === "ar";
  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const waText = isAr
    ? "مرحباً، أريد الاستفسار عن الرعاية المنزلية"
    : "Hello, I'd like to ask about home healthcare";
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`
    : null;

  const busyText = isAr
    ? "المساعد مشغول حالياً. حاول مرة أخرى بعد دقيقة، أو راسلنا على واتساب."
    : "The assistant is busy right now. Please try again in a minute or message us on WhatsApp.";

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, open]);

  // Escape closes the chat
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      // Never send the "busy" notices back to the model
      const history = next
        .filter((m) => m.kind !== "busy")
        .map(({ role, content }) => ({ role, content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: busyText, kind: "busy" },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: busyText, kind: "busy" },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        insetInlineEnd: 20,
        zIndex: 50,
        direction: isAr ? "rtl" : "ltr",
      }}
    >
      <style>{`
        @media (max-width: 560px) {
          .chat-panel {
            position: fixed !important;
            inset: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

      {open && (
        <div
          className="chat-panel"
          role="dialog"
          aria-label={isAr ? "اسأل عن الرعاية المنزلية" : "Ask about home care"}
          style={{
            width: 320,
            height: 420,
            background: "#fff",
            border: "1px solid #e2e8e5",
            borderRadius: 14,
            boxShadow: "0 12px 32px rgba(0,0,0,.18)",
            display: "flex",
            flexDirection: "column",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              background: "#0f2e2b",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <span>
              {isAr ? "اسأل عن الرعاية المنزلية" : "Ask about home care"}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label={isAr ? "إغلاق المحادثة" : "Close chat"}
              style={{
                border: 0,
                background: "rgba(255,255,255,.14)",
                color: "#fff",
                width: 30,
                height: 30,
                borderRadius: "50%",
                fontSize: 16,
                lineHeight: 1,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          <div
            ref={listRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {messages.length === 0 && (
              <p style={{ color: "#888", fontSize: 13 }}>
                {isAr
                  ? "اسألني عن الخدمات أو كيفية الحجز."
                  : "Ask me about our services or how to book."}
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#0f2e2b" : "#dbe7e2",
                  color: m.role === "user" ? "#fff" : "#0f2e2b",
                  padding: "8px 12px",
                  borderRadius: 10,
                  maxWidth: "85%",
                  fontSize: 14,
                }}
              >
                {m.content}
                {m.kind === "busy" && waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      marginTop: 8,
                      background: "#25D366",
                      color: "#fff",
                      padding: "7px 14px",
                      borderRadius: 999,
                      fontWeight: 700,
                      fontSize: 13,
                      textDecoration: "none",
                    }}
                  >
                    {isAr ? "راسلنا على واتساب" : "Message us on WhatsApp"}
                  </a>
                )}
              </div>
            ))}
            {sending && (
              <div style={{ color: "#888", fontSize: 13 }}>
                {isAr ? "يكتب..." : "Typing..."}
              </div>
            )}
          </div>

          <div style={{ display: "flex", borderTop: "1px solid #e2e8e5" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={isAr ? "اكتب سؤالك..." : "Type your question..."}
              style={{
                flex: 1,
                border: 0,
                padding: 12,
                fontSize: 16,
                outline: "none",
                background: "#fff",
                color: "#0f2e2b",
                borderRadius: 0,
              }}
            />
            <button
              onClick={send}
              disabled={sending}
              style={{
                border: 0,
                background: "#b8975a",
                padding: "0 16px",
                fontWeight: 700,
                cursor: "pointer",
                color: "#1b1608",
              }}
            >
              {isAr ? "إرسال" : "Send"}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#0f2e2b",
          color: "#fff",
          border: 0,
          fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        }}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
