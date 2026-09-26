"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import House from "@/components/House";
import Reveal from "@/components/Reveal";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section className="hero">
      <div className="wrap">
        <Reveal stagger={0.15} y={24}>
          <h1>{t.h1}</h1>
          <p className="sub">{t.sub}</p>
          <div className="cta">
            <a className="btn" href="#book">
              {t.book}
            </a>
            <a className="btn ghost" href="#home">
              {t.explore}
            </a>
          </div>
          <div className="trust">
            <span>
              <b>24/7</b>
              <em style={{ fontStyle: "normal" }}>{t.t1}</em>
            </span>
            <span>
              <b>{t.t2n}</b>
              <em style={{ fontStyle: "normal" }}>{t.t2}</em>
            </span>
            <span>
              <b>AR &middot; EN</b>
              <em style={{ fontStyle: "normal" }}>{t.t3}</em>
            </span>
          </div>
        </Reveal>
        <House />
      </div>
    </section>
  );
}
