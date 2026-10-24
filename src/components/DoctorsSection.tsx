"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import DoctorCard from "@/components/DoctorCard";
import type { Doctor } from "@/lib/types";

type CrewMember = Doctor & { category?: "doctor" | "nurse" };

export default function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  const { t, locale } = useLanguage();
  const ar = locale === "ar";

  const crew = doctors as CrewMember[];
  // Anyone without a category yet counts as a doctor.
  const docs = crew.filter((d) => d.category !== "nurse");
  const nurses = crew.filter((d) => d.category === "nurse");

  const groups = [
    { id: "doctors", title: ar ? "الأطباء" : "Doctors", list: docs },
    { id: "nurses", title: ar ? "التمريض" : "Nurses", list: nurses },
  ].filter((g) => g.list.length > 0);

  return (
    <section id="crew" style={{ background: "var(--sage)" }}>
      <div className="wrap">
        <div className="head">
          <h2>{t.dh}</h2>
          <p>{t.dp}</p>
        </div>

        {groups.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            {groups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="btn ghost"
                style={{ padding: "10px 22px", fontSize: 14 }}
              >
                {g.title} ({g.list.length})
              </a>
            ))}
          </div>
        )}

        {groups.map((g, i) => (
          <div
            key={g.id}
            id={g.id}
            style={{
              marginTop: i === 0 ? 0 : 72,
              scrollMarginTop: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <h2 style={{ margin: 0 }}>{g.title}</h2>
              <span
                style={{
                  background: "var(--brass)",
                  color: "#1b1608",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "4px 14px",
                  borderRadius: 999,
                }}
              >
                {g.list.length}
              </span>
              <span style={{ flex: 1, height: 1, background: "var(--line)" }} />
            </div>

            <div className="docs">
              {g.list.map((d) => (
                <DoctorCard key={d.id} doctor={d} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
