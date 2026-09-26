"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { translations } from "@/lib/i18n/translations";

type Ctx = { locale: Locale; t: typeof translations["en"]; toggle: () => void };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  // Restore saved preference on mount (client only — avoids SSR/client mismatch).
  useEffect(() => {
    const saved = window.localStorage.getItem("locale") as Locale | null;
    if (saved === "en" || saved === "ar") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("locale", locale);
  }, [locale]);

  const toggle = () => setLocale((l) => (l === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside <LanguageProvider>");
  return ctx;
}
