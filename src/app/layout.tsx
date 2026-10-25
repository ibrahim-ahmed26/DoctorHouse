import type { Metadata } from "next";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import "./globals.css";
import ToasterProvider from "@/components/ToasterProvider";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://www.dr-housecare.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Doctor House Care | Home healthcare in Egypt",
    template: "%s | Doctor House Care",
  },
  description:
    "Doctors, nurses, medication and follow-up at your home in Egypt. Book a home visit with Doctor House Care. رعاية طبية منزلية: أطباء وتمريض في بيتك.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Doctor House Care",
    title: "Doctor House Care | Home healthcare in Egypt",
    description: "The hospital experience, at home. Book a home visit.",
    images: [{ url: "/hero.jpeg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;700&family=Noto+Kufi+Arabic:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <ToasterProvider />
      </body>
    </html>
  );
}
