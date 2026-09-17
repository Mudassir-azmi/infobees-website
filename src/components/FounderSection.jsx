import { FaCheckCircle } from "react-icons/fa";
import founderImg from "../assets/images/founder/founder-placeholder.svg";
import SectionHeader from "./SectionHeader";
import { founderCredentials } from "../data/services";

function FounderSection() {
  return (
    <section id="about" className="relative overflow-hidden bg-bg-light py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Leadership" title="Academic Leadership" />

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-start gap-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[280px_1fr]">
          <div className="mx-auto w-full max-w-[240px] lg:mx-0">
            <img
              src={founderImg}
              alt="Portrait placeholder of Dr. Fakhre Alam, Founder of Infobees"
              className="aspect-square w-full rounded-2xl border-2 border-gold/30 object-cover shadow-md"
            />
          </div>

          <div>
            <h3 className="text-2xl font-bold text-navy">Dr. Fakhre Alam</h3>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-gold">
              Founder, Infobees
            </p>

            <ul className="mt-6 space-y-3">
              {founderCredentials.map((credential) => (
                <li key={credential} className="flex items-start gap-3 text-sm text-text-muted">
                  <FaCheckCircle className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                  <span>{credential}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-slate-200 pt-6">
              <p className="text-sm leading-relaxed text-text-dark">
                <span className="font-semibold text-navy">Value proposition: </span>
                Ethical guidance, institutional insight, academic rigor, and
                research methodology advisory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FounderSection;
