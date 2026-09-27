import Hero from "../components/Hero";
import { useSection } from "../context/siteContent";
import { useSeo } from "../lib/seo";
import { organizationSchema } from "../lib/structuredData";
import ContactSection from "../sections/ContactSection";
import LatestNoticeSection from "../sections/LatestNoticeSection";
import LeadershipSection from "../sections/LeadershipSection";
import ServicesOverview from "../sections/ServicesOverview";
import WhyInfobees from "../sections/WhyInfobees";

// Navbar, Footer and floating buttons come from PublicLayout.
function HomePage() {
  const services = useSection("services").items;
  const persons = useSection("contact").items;
  const social = useSection("social").items;

  useSeo({ path: "/", jsonLd: organizationSchema({ services, persons, social }) });

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
