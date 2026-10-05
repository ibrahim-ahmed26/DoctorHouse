"use client";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";

export default function CrewTeaser() {
  const { t } = useLanguage();
  return (
    <section style={{ background: "var(--sage)" }}>
      <div className="wrap">
        <Reveal
          stagger={0.1}
          y={20}
          style={{ textAlign: "center", maxWidth: 560, margin: "0 auto" }}
        >
          <h2>{t.dh}</h2>
          <p style={{ color: "var(--mute)", marginTop: 14, fontSize: 16 }}>
            {t.dp}
          </p>
          <Link
            href="/our-crew"
            className="btn"
            style={{ marginTop: 28, display: "inline-block" }}
          >
            {t.crewCta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
