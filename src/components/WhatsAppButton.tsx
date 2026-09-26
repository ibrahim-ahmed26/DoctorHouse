"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function WhatsAppButton() {
  const { locale } = useLanguage();
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!number) return null;

  const isAr = locale === "ar";
  const message = isAr
    ? "مرحباً، أريد الاستفسار عن الرعاية المنزلية"
    : "Hello, I'd like to ask about home healthcare";

  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: 20,
        insetInlineStart: 20,
        zIndex: 50,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#25D366",
        display: "grid",
        placeItems: "center",
        boxShadow: "0 8px 20px rgba(0,0,0,.25)",
        textDecoration: "none",
      }}
    >
      <svg viewBox="0 0 32 32" width="30" height="30" fill="#fff">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.837.744 5.5 2.05 7.813L.132 31.5a.5.5 0 0 0 .61.61l7.687-1.918A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.09c-2.53 0-4.913-.68-6.972-1.87l-.5-.29-4.51 1.126 1.148-4.4-.32-.52A13.06 13.06 0 0 1 2.91 16C2.91 8.784 8.784 2.91 16 2.91S29.09 8.784 29.09 16 23.216 29.09 16 29.09zm7.24-9.79c-.397-.198-2.35-1.16-2.714-1.293-.364-.132-.63-.198-.894.198-.264.397-1.026 1.293-1.258 1.557-.232.264-.463.297-.86.1-.397-.198-1.677-.618-3.196-1.973-1.182-1.054-1.98-2.355-2.212-2.752-.232-.397-.024-.612.174-.81.198-.198.397-.463.595-.694.198-.232.264-.397.397-.66.132-.264.066-.496-.033-.694-.1-.198-.827-1.99-1.133-2.726-.298-.716-.6-.62-.827-.63-.213-.01-.463-.012-.71-.012-.248 0-.65.1-.99.397-.34.298-1.3 1.27-1.3 3.1s1.334 3.598 1.517 3.846c.183.248 2.526 3.857 6.13 5.257 3.606 1.4 3.606.934 4.256.874.65-.06 2.35-.958 2.68-1.882.33-.925.33-1.717.232-1.882-.1-.165-.364-.264-.76-.463z" />
      </svg>
    </a>
  );
}
