import ServiceGrid from "../components/ServiceGrid";
import SectionHeader from "../components/SectionHeader";
import { useSection } from "../context/siteContent";
import { toServiceCard } from "../lib/sections";

function ServicesOverview() {
  const section = useSection("services");

  return (
    <section id="services" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />
        {section.items.length ? (
          <ServiceGrid items={section.items.map(toServiceCard)} columns={3} />
        ) : (
          <p className="text-center text-text-muted">Our services will be listed here soon.</p>
        )}
      </div>
    </section>
  );
}

export default ServicesOverview;
