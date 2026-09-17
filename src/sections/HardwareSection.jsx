import ServiceGrid from "../components/ServiceGrid";
import SectionIntroBanner from "../components/SectionIntroBanner";
import { hardwareServices, sectionImages } from "../data/services";

function HardwareSection() {
  return (
    <section id="hardware" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntroBanner
          eyebrow="Hardware Division"
          title="IT Hardware & Custom PC Solutions"
          subtitle="Custom builds, retail electronics and dependable maintenance for home, academic and business use."
          image={sectionImages.hardware}
          imageAlt="Illustration representing Infobees' IT hardware and custom PC solutions"
          reverse
        />
        <ServiceGrid items={hardwareServices} columns={4} />
      </div>
    </section>
  );
}

export default HardwareSection;
