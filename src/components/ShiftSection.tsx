"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function ShiftSection() {
  const { t } = useLanguage();
  return (
    <section>
      <div className="wrap">
        <div className="head">
          <h2>{t.s1h}</h2>
          <p>{t.s1p}</p>
        </div>
        <div className="shift">
          {t.shift.map((s, i) => (
            <div key={i}>
              <div className="old">{s[0]}</div>
              <div className="new">{s[1]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
