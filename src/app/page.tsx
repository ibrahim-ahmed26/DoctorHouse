import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShiftSection from "@/components/ShiftSection";
import DoctorsSection from "@/components/DoctorsSection";
import HowItWorks from "@/components/HowItWorks";
import Quote from "@/components/Quote";
import Partners from "@/components/Partners";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { getDoctors } from "@/lib/doctors";
import WhatsAppButton from "@/components/WhatsAppButton";

// Server Component: fetches doctors from Firestore on the server, once per request.
export default async function Home() {
  const doctors = await getDoctors();

  return (
    <main id="top">
      <Header />
      <Hero />
      <ShiftSection />
      <DoctorsSection doctors={doctors} />
      <HowItWorks />
      <Quote />
      <Partners />
      <BookingForm />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  );
}
