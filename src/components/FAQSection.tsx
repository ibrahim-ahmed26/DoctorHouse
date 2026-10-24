"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

type Item = { q: string; a: string };

export default function FAQSection() {
  const { t, locale } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);
  const [remote, setRemote] = useState<
    { q: { en: string; ar: string }; a: { en: string; ar: string } }[] | null
  >(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => (r.ok ? r.json() : { faqs: [] }))
      .then((d) => setRemote(d.faqs?.length ? d.faqs : null))
      .catch(() => setRemote(null));
  }, []);

  const lang = locale === "ar" ? "ar" : "en";
  const items: Item[] = remote
    ? remote.map((f) => ({ q: f.q[lang], a: f.a[lang] }))
    : t.faq.map((x: string[]) => ({ q: x[0], a: x[1] }));

  return (
    <section id="faq">
      <div className="wrap">
        <div className="head">
          <h2>{t.faqHead}</h2>
          <p>{t.faqSub}</p>
        </div>
        <Reveal
          key={remote ? "remote" : "default"}
          className="faq-list"
          stagger={0.08}
          y={16}
        >
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item${isOpen ? " open" : ""}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? 300 : 0 }}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
