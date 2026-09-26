"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import { gsap } from "@/lib/gsap";

const ICONS: Record<string, string> = {
  doc: '<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-3a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v3"/>',
  nurse:
    '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
  lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="12" cy="12" r="4"/>',
  med: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-35 12 12)"/><path d="m9 15 6-6"/>',
  eq: '<path d="M4 14h16M6 14V8h6v6M4 18h16M7 18v2M17 18v2"/>',
  web: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
  door: '<path d="M6 21V4h12v17M4 21h16"/><circle cx="15" cy="12.5" r=".8"/>',
};

export default function House() {
  const { t } = useLanguage();
  const [cur, setCur] = useState(0);
  const room = t.rooms[cur];
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
    );
  }, [cur]);

  return (
    <div className="house" id="home">
      <div className="roof">{t.roof}</div>
      <Reveal className="rooms" role="group" stagger={0.05} y={16}>
        {t.rooms.map((r, i) => (
          <button
            key={i}
            className={`room${i === 7 ? " door" : ""}`}
            aria-pressed={i === cur}
            onClick={() => setCur(i)}
          >
            <svg
              viewBox="0 0 24 24"
              dangerouslySetInnerHTML={{ __html: ICONS[r[0]] }}
            />
            <span>{r[1]}</span>
          </button>
        ))}
      </Reveal>
      <div className="panel" ref={panelRef} aria-live="polite">
        <h3>{room[1]}</h3>
        <p>{room[2]}</p>
      </div>
    </div>
  );
}
