import ServiceGrid from "../components/ServiceGrid";
import SectionIntroBanner from "../components/SectionIntroBanner";
import { fabricationServices, sectionImages } from "../data/services";

function FabricationSection() {
  return (
    <section id="fabrication" className="bg-bg-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntroBanner
          eyebrow="Fabrication Studio"
          title="On-Demand Custom Micro-Fabrication"
          subtitle="Precision customization for personal, commercial and prototype requirements."
          image={sectionImages.fabrication}
          imageAlt="Illustration representing Infobees' micro-fabrication studio"
        />
        <ServiceGrid items={fabricationServices} columns={3} />
      </div>
    </section>
  );
}

export default FabricationSection;
