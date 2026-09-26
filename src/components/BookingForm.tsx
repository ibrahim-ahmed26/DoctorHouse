"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function BookingForm() {
  const { t, locale } = useLanguage();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

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

  return (
    <section id="book">
      <div className="wrap book">
        <div>
          <h2>{t.bh}</h2>
          <p style={{ color: "var(--mute)", marginTop: 14 }}>{t.bp}</p>
        </div>
        <form onSubmit={onSubmit}>
          <label><span>{t.f1}</span><input name="name" required autoComplete="name" /></label>
          <label><span>{t.f2}</span><input name="phone" required type="tel" autoComplete="tel" /></label>
          <label>
            <span>{t.f3}</span>
            <select name="need" defaultValue="">
              <option value="" disabled>{t.f3}</option>
              {t.opts.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </label>
          <button className="btn" type="submit" disabled={status === "sending"}>{t.send}</button>
          {status === "ok" && (
            <div role="status" style={{ display: "block" }} id="ok">{t.ok}</div>
          )}
          {status === "error" && (
            <div role="alert" style={{ display: "block", background: "#f3d3d3" }} id="ok">
              Something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
