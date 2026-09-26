"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function Quote() {
  const { t } = useLanguage();
  return (
    <section>
      <div className="wrap">
        <Reveal stagger={0.15} y={16}>
          <p className="quote">{t.q}</p>
          <p className="who">{t.qw}</p>
        </Reveal>
      </div>
    </section>
  );
}
