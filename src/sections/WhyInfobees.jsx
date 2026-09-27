import DynamicIcon from "../components/DynamicIcon";
import SectionHeader from "../components/SectionHeader";
import { useSection } from "../context/siteContent";

function WhyInfobees() {
  const section = useSection("why");
  if (!section.items.length) return null;

  return (
    <section id="why" className="relative overflow-hidden bg-gradient-navy py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.04]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} light />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 transition-colors hover:border-gold/40"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 text-gold">
                <DynamicIcon icon={item.icon} size={20} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-white">{item.title}</h3>
              {item.description && (
                <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyInfobees;
