import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DoctorsSection from "@/components/DoctorsSection";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getDoctors } from "@/lib/doctors";
export const metadata = {
  title: "Our Crew: Doctors & Nurses",
  description: "Meet the doctors and nurses of Doctor House Care.",
  alternates: { canonical: "/our-crew" },
};
export default async function OurCrewPage() {
  const doctors = await getDoctors();

  return (
    <main>
      <Header />
      <div style={{ height: 40 }} />
      <DoctorsSection doctors={doctors} />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  );
}
