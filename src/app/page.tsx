import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ShiftSection from "@/components/ShiftSection";
import CrewTeaser from "@/components/CrewTeaser";
import HowItWorks from "@/components/HowItWorks";
import Quote from "@/components/Quote";
import Partners from "@/components/Partners";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import Preloader from "@/components/preloader";
import FAQSection from "@/components/FAQSection";
import DocumentsSection from "@/components/DocumentsSection";

export default async function Home() {
  return (
    <main id="top">
      <Preloader />
      <Header />
      <Hero />
      <ShiftSection />
      <CrewTeaser />
      <HowItWorks />
      <Quote />
      <Partners />
      <DocumentsSection />
      <FAQSection />
      <BookingForm />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  );
}
