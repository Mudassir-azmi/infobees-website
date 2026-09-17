import FounderSection from "./components/FounderSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import BackToTopButton from "./components/BackToTopButton";
import ServicesOverview from "./sections/ServicesOverview";
import AcademicSection from "./sections/AcademicSection";
import SoftwareSection from "./sections/SoftwareSection";
import DigitalServicesSection from "./sections/DigitalServicesSection";
import FabricationSection from "./sections/FabricationSection";
import HardwareSection from "./sections/HardwareSection";
import WhyInfobees from "./sections/WhyInfobees";
import ContactSection from "./sections/ContactSection";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <ServicesOverview />
        <FounderSection />
        <AcademicSection />
        <SoftwareSection />
        <DigitalServicesSection />
        <FabricationSection />
        <HardwareSection />
        <WhyInfobees />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
    </div>
  );
}

export default App;
