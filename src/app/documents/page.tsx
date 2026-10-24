import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentsGate from "@/components/DocumentsGate";
import DocumentsSection from "@/components/DocumentsSection";

export const metadata = { title: "Doctor's Guides — Doctor House Care" };

export default function DocumentsPage() {
  return (
    <>
      <Header />
      <main>
        <DocumentsGate>
          <DocumentsSection />
        </DocumentsGate>
      </main>
      <Footer />
    </>
  );
}
