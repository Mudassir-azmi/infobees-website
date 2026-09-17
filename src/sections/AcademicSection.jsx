import ServiceGrid from "../components/ServiceGrid";
import SectionIntroBanner from "../components/SectionIntroBanner";
import { academicServices, sectionImages } from "../data/services";

function AcademicSection() {
  return (
    <section id="academic" className="bg-bg-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntroBanner
          eyebrow="Academic Division"
          title="Academic & Research Consulting"
          subtitle="Structured guidance for students, researchers and academic professionals navigating higher education and research."
          image={sectionImages.academic}
          imageAlt="Illustration representing academic and research consulting at Infobees"
        />
        <ServiceGrid items={academicServices} columns={3} />
      </div>
    </section>
  );
}

export default AcademicSection;
