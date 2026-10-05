"use client";
import { useEffect, useRef, useState } from "react";

export default function PdfCanvasViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setLoading(true);
      setError(null);
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const pdf = await pdfjsLib.getDocument({ url }).promise;
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.4 });

          const canvas = document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = "100%";
          canvas.style.maxWidth = `${viewport.width}px`;
          canvas.style.display = "block";
          canvas.style.margin = "0 auto 14px";
          canvas.style.borderRadius = "8px";
          canvas.style.boxShadow = "0 2px 10px rgba(0,0,0,.15)";

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          if (!cancelled && containerRef.current) {
            containerRef.current.appendChild(canvas);
          }
        }
      } catch (err: any) {
        if (!cancelled) setError(err?.message ?? "Failed to load document");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div
      style={{
        height: "100%",
        overflowY: "auto",
        padding: 16,
        background: "#e9edec",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {loading && (
        <p style={{ textAlign: "center", color: "#888", padding: 40 }}>
          Loading...
        </p>
      )}
      {error && (
        <p style={{ textAlign: "center", color: "#d33", padding: 40 }}>
          {error}
        </p>
      )}
      <div ref={containerRef} style={{ userSelect: "none" }} />
    </div>
  );
}
