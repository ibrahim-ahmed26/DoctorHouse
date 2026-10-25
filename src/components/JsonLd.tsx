const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.dr-housecare.com";

export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Doctor House Care",
    url: SITE,
    logo: `${SITE}/logo.png`,
    image: `${SITE}/hero.jpeg`,
    description:
      "Home healthcare in Egypt: doctors, nurses, medication and follow-up at home.",
    telephone: "+201110999375",
    areaServed: { "@type": "Country", name: "Egypt" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
