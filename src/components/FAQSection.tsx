"use client";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function FAQSection() {
  const { t } = useLanguage();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq">
      <div className="wrap">
        <div className="head">
          <h2>{t.faqHead}</h2>
          <p>{t.faqSub}</p>
        </div>
        <Reveal className="faq-list" stagger={0.08} y={16}>
          {t.faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`faq-item${isOpen ? " open" : ""}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span>{item[0]}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                <div className="faq-a" style={{ maxHeight: isOpen ? 300 : 0 }}>
                  <p>{item[1]}</p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
