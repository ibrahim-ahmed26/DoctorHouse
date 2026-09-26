"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Header() {
  const { t, locale, toggle } = useLanguage();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const mobileMenu = (
    <>
      <div
        className={`mobile-overlay${open ? " open" : ""}`}
        onClick={() => setOpen(false)}
      />
      <nav className={`mobile-nav${open ? " open" : ""}`}>
        <a href="#home" onClick={() => setOpen(false)}>
          {t.n1}
        </a>
        <a href="#doctors" onClick={() => setOpen(false)}>
          {t.n2}
        </a>
        <a href="#how" onClick={() => setOpen(false)}>
          {t.n3}
        </a>
        <a href="#partners" onClick={() => setOpen(false)}>
          {t.n4}
        </a>
        <a
          className="btn brass mobile-nav-cta"
          href="#book"
          onClick={() => setOpen(false)}
        >
          {t.book}
        </a>
      </nav>
    </>
  );

  return (
    <header>
      <div className="wrap bar">
        <a className="logo" href="#top">
          <i />
          <span>{t.brand}</span>
        </a>

        <nav className="desktop-nav">
          <a href="#home">{t.n1}</a>
          <a href="#doctors">{t.n2}</a>
          <a href="#how">{t.n3}</a>
          <a href="#partners">{t.n4}</a>
        </nav>

        <button className="lang" onClick={toggle} aria-label="Switch language">
          {locale === "en" ? "العربية" : "English"}
        </button>
        <a className="btn brass desktop-cta" href="#book">
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

      {mounted && createPortal(mobileMenu, document.body)}
    </header>
  );
}
