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
import VideoBanner from "@/components/VideoBanner";

export default async function Home() {
  return (
    <main id="top">
      <Preloader />
      <Header />
      <VideoBanner src="/HeaderVideo.mp4" contained={false} />
      <Hero />
      <ShiftSection />
      <CrewTeaser />
      <HowItWorks />
      <Quote />
      <Partners />
      <FAQSection />
      <BookingForm />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  );
}
