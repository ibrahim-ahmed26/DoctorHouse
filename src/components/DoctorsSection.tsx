"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import Reveal from "@/components/Reveal";
import DoctorCard from "@/components/DoctorCard";
import type { Doctor } from "@/lib/types";

export default function DoctorsSection({ doctors }: { doctors: Doctor[] }) {
  const { t } = useLanguage();
  return (
    <section id="doctors" style={{ background: "var(--sage)" }}>
      <div className="wrap">
        <div className="head">
          <h2>{t.dh}</h2>
          <p>{t.dp}</p>
        </div>
        <Reveal className="docs" stagger={0.12} y={24}>
          {doctors.map((d) => (
            <DoctorCard key={d.id} doctor={d} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
