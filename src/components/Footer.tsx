"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  const instagram =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/";
  const facebook =
    process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://facebook.com/";

  return (
    <footer>
      <div className="wrap footer-grid">
        <div>
          <div className="footer-brand">{t.brand}</div>
          <p className="footer-tag">{t.foot}</p>
        </div>

        <div className="footer-address">
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 21s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span>{t.address}</span>
        </div>

        <div className="footer-social">
          <span className="footer-follow">{t.follow}</span>
          <div className="footer-icons">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.2"
                  cy="6.8"
                  r="1.1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M15 8h2V5h-2a4 4 0 0 0-4 4v2H9v3h2v7h3v-7h2.2l.8-3H14V9a1 1 0 0 1 1-1z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="wrap footer-copy">
        <span>&copy; {t.brand}</span>
      </div>
    </footer>
  );
}
