"use client";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import PdfCanvasViewer from "@/components/PdfCanvasViewer";

type ViewDoc = { id: string; title: { en: string; ar: string }; url: string };

export default function DocumentsSection() {
  const { t, locale } = useLanguage();
  const [docs, setDocs] = useState<ViewDoc[]>([]);
  const [viewing, setViewing] = useState<ViewDoc | null>(null);

  const [downloadPrompt, setDownloadPrompt] = useState(false);
  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch("/api/documents/view")
      .then((r) => r.json())
      .then((d) => setDocs(d.docs ?? []));
  }, []);

  useEffect(() => {
    if (!viewing) return;
    function blockPrint(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    window.addEventListener("keydown", blockPrint, true);
    return () => window.removeEventListener("keydown", blockPrint, true);
  }, [viewing]);

  if (docs.length === 0) return null;

  async function confirmDownload(e: React.FormEvent) {
    e.preventDefault();
    if (!viewing) return;
    setDownloading(true);
    setDownloadError(null);

    const res = await fetch("/api/documents/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    <section id="documents">
      <div className="wrap">
        <div className="head">
          <h2>{t.docsHead}</h2>
          <p>{t.docsSub}</p>
        </div>

        <Reveal className="docs-grid" stagger={0.1} y={18}>
          {docs.map((d) => (
            <div key={d.id} className="doc-card">
              <div className="doc-card-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="28"
                  height="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M7 3h7l4 4v14H7z" />
                  <path d="M14 3v4h4" />
                </svg>
              </div>
              <h3>{d.title[locale]}</h3>
              <button className="btn" onClick={() => setViewing(d)}>
                {t.docsView}
              </button>
            </div>
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
            <PdfCanvasViewer url={viewing.url} />

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
