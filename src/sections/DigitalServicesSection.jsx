import ServiceGrid from "../components/ServiceGrid";
import SectionIntroBanner from "../components/SectionIntroBanner";
import { civicServices, sectionImages } from "../data/services";

function DigitalServicesSection() {
  return (
    <section id="civic-services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntroBanner
          eyebrow="Civic & Business"
          title="Digital Civic & Business Services"
          subtitle="Everyday digital, banking-facilitation and documentation support handled with care and transparency."
          image={sectionImages.civic}
          imageAlt="Illustration representing Infobees' digital civic and business services"
          reverse
        />
        <ServiceGrid items={civicServices} columns={4} />
      </div>
    </section>
  );
}

export default DigitalServicesSection;
