"use client";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [hasLogo, setHasLogo] = useState(true);

  useEffect(() => {
    // Only show once per browser tab session — not on every internal navigation.
    if (sessionStorage.getItem("seenPreloader")) {
      setVisible(false);
      return;
    }

    const minDisplay = window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches
      ? 0
      : 700;
    const start = Date.now();

    function finish() {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, minDisplay - elapsed);
      setTimeout(() => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem("seenPreloader", "1");
        }, 400);
      }, wait);
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish);
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "var(--pine)",
        display: "grid",
        placeItems: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity .4s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {hasLogo ? (
          <img
            src="/logo.png"
            alt="Doctor House Care"
            onError={() => setHasLogo(false)}
            style={{ width: 96, height: 96, objectFit: "contain" }}
          />
        ) : (
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path
              d="M14 30c0-12 9.8-22 22-22s22 10 22 22"
              stroke="var(--brass)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="36" cy="38" r="6" fill="var(--brass)" />
            <path
              d="M36 44c-7 0-12 5-12 11 0 0 5 4 12 4s12-4 12-4c0-6-5-11-12-11z"
              stroke="var(--brass)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        )}
        <div
          style={{
            fontFamily: "var(--serif)",
            fontSize: 22,
            color: "var(--on)",
            fontWeight: 600,
            letterSpacing: "-.01em",
          }}
        >
          Dr.House Care
        </div>
        <div className="preloader-bar">
          <div className="preloader-fill" />
        </div>
      </div>
    </div>
  );
}
