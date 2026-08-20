import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import IntelligenceFlow from "@/components/landing/IntelligenceFlow";
import Architecture from "@/components/landing/Architecture";
import VendorGraph from "@/components/landing/VendorGraph";
import AssessmentPreview from "@/components/landing/AssessmentPreview";
import TrustSection from "@/components/landing/TrustSection";
import Solutions from "@/components/landing/Solutions";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <IntelligenceFlow />
        <Architecture />
        <VendorGraph />
        <AssessmentPreview />
        <TrustSection />
        <Solutions />
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}