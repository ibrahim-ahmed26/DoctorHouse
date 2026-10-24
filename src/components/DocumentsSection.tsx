"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import PdfCanvasViewer from "@/components/PdfCanvasViewer";
import { authFetch } from "@/lib/docs/client";
type ViewDoc = { id: string; title: { en: string; ar: string }; url: string };

export default function DocumentsSection() {
  const { t, locale } = useLanguage();
  const [docs, setDocs] = useState<ViewDoc[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [viewing, setViewing] = useState<ViewDoc | null>(null);

  const [downloadPrompt, setDownloadPrompt] = useState(false);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [shielded, setShielded] = useState(false);

  useEffect(() => {
    authFetch("/api/documents/view")
      .then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((d) => setDocs(d.docs ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!viewing) return;
    const hide = () => setShielded(true);
    const show = () => {
      if (document.hasFocus() && !document.hidden) setShielded(false);
    };
    const onVis = () => (document.hidden ? hide() : show());

    function onKeyDown(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && (k === "p" || k === "s")) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.metaKey && e.shiftKey) {
        hide(); // Mac screenshot shortcuts
        setTimeout(show, 2000);
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "PrintScreen") {
        navigator.clipboard?.writeText(" ").catch(() => {});
        hide();
        setTimeout(show, 1500);
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      document.removeEventListener("visibilitychange", onVis);
      setShielded(false);
    };
  }, [viewing]);

  if (!loaded) return null;
  if (docs.length === 0)
    return (
      <section id="documents" className="cover-head">
        <div className="wrap">
          <div className="head">
            <h2>{t.docsHead}</h2>
            <p>
              {locale === "ar"
                ? "لا توجد مستندات حاليًا."
                : "No documents yet."}
            </p>
          </div>
        </div>
      </section>
    );

  async function confirmDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!viewing) return;
    setDownloading(true);
    setDownloadError(null);

    const res = await authFetch("/api/documents/verify", {
      method: "POST",
      body: JSON.stringify({ password: downloadPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setDownloadError(data.error ?? t.docsWrong);
      setDownloading(false);
      return;
    }

    const freshDoc = (data.docs as ViewDoc[]).find((d) => d.id === viewing.id);
    if (!freshDoc) {
      setDownloadError(t.docsWrong);
      setDownloading(false);
      return;
    }

    const fileRes = await fetch(freshDoc.url);
    const blob = await fileRes.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `${freshDoc.title[locale]}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);

    setDownloading(false);
    setDownloadPrompt(false);
    setDownloadPassword("");
  }

  return (
    <section
      id="documents"
      className="cover-head"
      style={{ backgroundImage: "url(/Book.jpg.jpeg)" }}
    >
      <div className="wrap">
        <div className="head">
          <h2>{t.docsHead}</h2>
          <p>{t.docsSub}</p>
        </div>

        <Reveal className="docs-grid" stagger={0.1} y={18}>
          {docs.map((d) => (
            <button
              key={d.id}
              type="button"
              className="doc-card"
              onClick={() => setViewing(d)}
              aria-label={`${t.docsView}: ${d.title[locale]}`}
            >
              <span className="doc-card-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="56"
                  height="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 3h7l4 4v14H7z" />
                  <path d="M14 3v4h4" />
                </svg>
                <span className="doc-card-eye">
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </span>
              </span>
              <span className="doc-card-title">{d.title[locale]}</span>
            </button>
          ))}
        </Reveal>
      </div>

      {viewing && (
        <div
          className="doc-viewer-overlay"
          onClick={() => {
            setViewing(null);
            setDownloadPrompt(false);
          }}
        >
          <div
            className="doc-viewer"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="doc-viewer-bar">
              <span>{viewing.title[locale]}</span>
              <div className="doc-viewer-actions">
                <button
                  className="doc-viewer-download"
                  onClick={() => setDownloadPrompt(true)}
                >
                  {locale === "ar" ? "تحميل" : "Download"}
                </button>
                <button
                  onClick={() => {
                    setViewing(null);
                    setDownloadPrompt(false);
                  }}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className={`doc-shield${shielded ? " on" : ""}`}>
              <PdfCanvasViewer url={viewing.url} />
              <div className="doc-watermark" aria-hidden="true">
                {Array.from({ length: 60 }).map((_, i) => (
                  <span key={i}>Dr. Mamdouh</span>
                ))}
              </div>
            </div>

            {downloadPrompt && (
              <div
                className="download-gate-overlay"
                onClick={() => setDownloadPrompt(false)}
              >
                <form
                  className="download-gate"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={confirmDownload}
                >
                  <p>
                    {locale === "ar"
                      ? "أدخل كلمة المرور للتحميل"
                      : "Enter the password to download"}
                  </p>
                  <input
                    type="password"
                    value={downloadPassword}
                    onChange={(e) => setDownloadPassword(e.target.value)}
                    placeholder={t.docsPasswordPlaceholder}
                    autoFocus
                    required
                  />
                  {downloadError && (
                    <p className="docs-error">{downloadError}</p>
                  )}
                  <div className="download-gate-actions">
                    <button
                      className="btn"
                      type="submit"
                      disabled={downloading}
                    >
                      {downloading
                        ? "..."
                        : locale === "ar"
                          ? "تحميل"
                          : "Download"}
                    </button>
                    <button
                      type="button"
                      className="btn ghost"
                      onClick={() => setDownloadPrompt(false)}
                    >
                      {locale === "ar" ? "إلغاء" : "Cancel"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
