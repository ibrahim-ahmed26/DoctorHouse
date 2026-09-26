"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function Partners() {
  const { t } = useLanguage();
  return (
    <section id="partners" style={{ background: "var(--sage)" }}>
      <div className="wrap">
        <div className="head">
          <h2>{t.ph}</h2>
          <p>{t.pp}</p>
        </div>
        <Reveal className="b2b" stagger={0.15} y={24}>
          {t.b2b.map((b, i) => (
            <div key={i}>
              <h3>{b[0]}</h3>
              <p>{b[1]}</p>
            </div>
          ))}
        </Reveal>
        <p style={{ marginTop: 32 }}>
          <a className="btn" href="#book">
            {t.pcta}
          </a>
        </p>
      </div>
    </section>
  );
}
