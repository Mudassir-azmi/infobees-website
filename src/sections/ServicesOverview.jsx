import ServiceGrid from "../components/ServiceGrid";
import SectionHeader from "../components/SectionHeader";
import { overviewServices } from "../data/services";

function ServicesOverview() {
  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What We Do"
          title="Our Expertise"
          subtitle="Integrated academic, research, technology and digital solutions under one roof."
        />
        <ServiceGrid items={overviewServices} columns={3} />
      </div>
    </section>
  );
}

export default ServicesOverview;
