"use client";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Doctor } from "@/lib/types";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  const { t, locale } = useLanguage();
  const name = doctor.name[locale];
  const initial = name
    .replace(/^(Dr\. |\u062F\. )/, "")
    .trim()
    .charAt(0);

  return (
    <article className="doc">
      <div className="doc-media">
        {doctor.imageUrl ? (
          <img src={doctor.imageUrl} alt={name} />
        ) : (
          <div className="doc-media-fallback">{initial}</div>
        )}
      </div>
      <div className="doc-body">
        <h3>{name}</h3>
        <div className="sp">{doctor.specialty[locale]}</div>
        <ul>
          <li>{doctor.experience[locale]}</li>
          <li>{doctor.highlights[locale][0]}</li>
          <li>{doctor.highlights[locale][1]}</li>
        </ul>
        <a href="#book">{t.dcta}</a>
      </div>
    </article>
  );
}
