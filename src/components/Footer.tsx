"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer>
      <div className="wrap">
        <span>&copy; {t.brand}</span>
        <span>{t.foot}</span>
      </div>
    </footer>
  );
}
