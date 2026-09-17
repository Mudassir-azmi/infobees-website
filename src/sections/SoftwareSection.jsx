import ServiceGrid from "../components/ServiceGrid";
import SectionHeader from "../components/SectionHeader";
import { additionalTechIcon, additionalTechServices, softwareCategories } from "../data/services";

function SoftwareSection() {
  const Icon = additionalTechIcon;

  return (
    <section id="technology" className="relative overflow-hidden bg-gradient-navy py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 line-grid opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Technology Division"
          title="Software & Digital Development"
          subtitle="From business websites to custom applications, Infobees builds practical digital solutions for modern organizations."
          light
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {softwareCategories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <div
                key={category.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors hover:border-gold/40"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold">
                  <CategoryIcon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-white">
                  {category.title}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  {category.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-gold/20 bg-white/5 p-7 text-center backdrop-blur">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
            <Icon size={20} aria-hidden="true" />
          </div>
          <h3 className="mb-3 text-lg font-semibold text-white">
            Additional Technology Services
          </h3>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-slate-300">
            {additionalTechServices.map((service, index) => (
              <span key={service} className="flex items-center gap-2">
                {service}
                {index < additionalTechServices.length - 1 && (
                  <span className="text-gold">&bull;</span>
                )}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

export default SoftwareSection;
