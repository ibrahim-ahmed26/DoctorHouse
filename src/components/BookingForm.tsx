"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function BookingForm() {
  const { t, locale } = useLanguage();
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setSending(true);
    const id = toast.loading(
      locale === "ar" ? "جارٍ الإرسال..." : "Sending...",
    );
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
      toast.success(t.ok, { id, duration: 6000 });
      form.reset();
    } catch {
      toast.error(
        locale === "ar"
          ? "حدث خطأ ما، حاول مرة أخرى."
          : "Something went wrong. Please try again.",
        { id },
      );
    } finally {
      setSending(false);
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

          <button className="btn book-submit" type="submit" disabled={sending}>
            {sending ? "..." : t.send}
          </button>
        </form>
      </div>
    </section>
  );
}
