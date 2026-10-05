"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function BookingForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">(
    "idle",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          need: data.get("need"),
          locale,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const perks = [
    { icon: "phone", text: t.book1 },
    { icon: "shield", text: t.book2 },
    { icon: "clock", text: t.book3 },
  ];

  return (
    <section id="book" className="book-section">
      <div className="wrap book">
        <div className="book-info">
          <span className="eyebrow">
            {locale === "ar" ? "احجز الآن" : "Book now"}
          </span>
          <h2>{t.bh}</h2>
          <p style={{ color: "var(--mute)", marginTop: 14, fontSize: 16 }}>
            {t.bp}
          </p>

          <ul className="book-perks">
            {perks.map((p, i) => (
              <li key={i}>
                <span className="book-perk-icon">
                  {p.icon === "phone" && (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
                    </svg>
                  )}
                  {p.icon === "shield" && (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  )}
                  {p.icon === "clock" && (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3.5 2" />
                    </svg>
                  )}
                </span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="book-form">
          <div className="book-field">
            <label>{t.f1}</label>
            <input
              name="name"
              required
              autoComplete="name"
              placeholder={t.f1}
            />
          </div>
          <div className="book-field">
            <label>{t.f2}</label>
            <input
              name="phone"
              required
              type="tel"
              autoComplete="tel"
              placeholder={t.f2}
            />
          </div>
          <div className="book-field">
            <label>{t.f3}</label>
            <select name="need" defaultValue="">
              <option value="" disabled>
                {t.f3}
              </option>
              {t.opts.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn book-submit"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "..." : t.send}
          </button>

          {status === "ok" && (
            <div className="book-status ok" role="status">
              {t.ok}
            </div>
          )}
          {status === "error" && (
            <div className="book-status error" role="alert">
              {locale === "ar"
                ? "حدث خطأ ما، حاول مرة أخرى."
                : "Something went wrong. Please try again."}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
