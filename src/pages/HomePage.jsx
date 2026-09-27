import Hero from "../components/Hero";
import ContactSection from "../sections/ContactSection";
import LatestNoticeSection from "../sections/LatestNoticeSection";
import LeadershipSection from "../sections/LeadershipSection";
import ServicesOverview from "../sections/ServicesOverview";
import WhyInfobees from "../sections/WhyInfobees";

// Navbar, Footer and floating buttons come from PublicLayout.
function HomePage() {
  return (
    <>
      <Hero />
      <LatestNoticeSection />
      <ServicesOverview />
      <LeadershipSection />
      <WhyInfobees />
      <ContactSection />
    </>
  );
}

export default HomePage;
