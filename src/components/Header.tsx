"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Header() {
  const { t, locale, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const drawer = (
    <>
      <div
        className={`mobile-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <nav className={`mobile-nav${open ? " open" : ""}`} aria-hidden={!open}>
        <button
          className="mobile-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        <a href="/#home" onClick={() => setOpen(false)}>
          {t.n1}
        </a>
        <Link href="/our-crew" onClick={() => setOpen(false)}>
          {t.n2}
        </Link>
        <a href="/#how" onClick={() => setOpen(false)}>
          {t.n3}
        </a>
        <a href="/#partners" onClick={() => setOpen(false)}>
          {t.n4}
        </a>
        <Link href="/documents" onClick={() => setOpen(false)}>
          {t.n6}
        </Link>
        <a href="/#faq" onClick={() => setOpen(false)}>
          {t.n5}
        </a>
        <a
          className="btn brass mobile-nav-cta"
          href="/#book"
          onClick={() => setOpen(false)}
        >
          {t.book}
        </a>
      </nav>
    </>
  );

  return (
    <>
      <header>
        <div className="wrap bar">
          <a className="logo" href="/#top">
            <img src="/logoDoctor.png" alt={t.brand} />
          </a>

          <nav className="desktop-nav">
            <a href="/#home">{t.n1}</a>
            <Link href="/our-crew">{t.n2}</Link>
            <a href="/#how">{t.n3}</a>
            <a href="/#partners">{t.n4}</a>
            <Link href="/documents">{t.n6}</Link>
            <a href="/#faq">{t.n5}</a>
          </nav>

          <button
            className="lang"
            onClick={toggle}
            aria-label="Switch language"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
          <a className="btn brass desktop-cta" href="/#book">
            {t.book}
          </a>

          <button
            className={`burger${open ? " open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
