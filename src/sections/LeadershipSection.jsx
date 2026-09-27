import { FaCheckCircle } from "react-icons/fa";
import founderPlaceholder from "../assets/images/founder/founder-placeholder.svg";
import Reveal from "../components/Reveal";
import SectionHeader from "../components/SectionHeader";
import { useSection } from "../context/siteContent";
import { optimizeImage } from "../lib/cloudinary";

/**
 * Item fields for a leader: title = name, subtitle = role, image_url = photo,
 * points = credentials, note = highlight label, description = highlight text.
 */
function LeaderCard({ leader }) {
  const altText = [leader.title, leader.subtitle].filter(Boolean).join(", ");

  return (
    <div className="grid grid-cols-1 items-start gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[280px_1fr]">
      <div className="mx-auto w-full max-w-[240px] lg:mx-0">
        <img
          src={optimizeImage(leader.image_url, 600) || founderPlaceholder}
          alt={leader.image_url ? `Portrait of ${altText}` : ""}
          loading="lazy"
          className="aspect-square w-full rounded-2xl border-2 border-gold/30 object-cover shadow-md"
        />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-navy">{leader.title}</h3>
        {leader.subtitle && (
          <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-gold">
            {leader.subtitle}
          </p>
        )}

        {leader.points?.length > 0 && (
          <ul className="mt-6 space-y-3">
            {leader.points.map((credential) => (
              <li key={credential} className="flex items-start gap-3 text-sm text-text-muted">
                <FaCheckCircle className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                <span>{credential}</span>
              </li>
            ))}
          </ul>
        )}

        {leader.description && (
          <div className="mt-8 border-t border-slate-200 pt-6">
            <p className="text-sm leading-relaxed text-text-dark">
              {leader.note && <span className="font-semibold text-navy">{leader.note}: </span>}
              {leader.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function LeadershipSection() {
  const section = useSection("about");
  if (!section.items.length) return null;

  return (
    <section id="about" className="relative overflow-hidden bg-bg-light py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />

        <div className="mx-auto max-w-5xl space-y-8">
          {section.items.map((leader, index) => (
            <Reveal key={leader.id} delay={Math.min(index, 3) * 100}>
              <LeaderCard leader={leader} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LeadershipSection;
