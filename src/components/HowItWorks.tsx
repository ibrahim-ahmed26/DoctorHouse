"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Marquee from "@/components/Marquee";

export default function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section className="band" id="how">
      <div className="wrap">
        <div className="head">
          <h2>{t.hh}</h2>
        </div>
      </div>
      <Marquee speed={26} gap={20}>
        {t.steps.map((s, i) => (
          <div className="step" key={i}>
            <span className="step-num">{i + 1}</span>
            <h3>{s[0]}</h3>
            <p>{s[1]}</p>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
