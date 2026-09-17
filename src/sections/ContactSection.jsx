import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import ContactForm from "../components/ContactForm";
import SectionHeader from "../components/SectionHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { contactInfo } from "../data/services";

function ContactSection() {
  return (
    <section id="contact" className="bg-bg-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Discuss Your Requirement"
          subtitle="Tell us what you need and the Infobees team will get back to you."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-navy">
              Contact Details
            </h3>
            <ul className="space-y-4 text-sm text-text-dark">
              <li className="font-semibold">{contactInfo.founderName}</li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-gold" aria-hidden="true" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-navy">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gold" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-navy">
                  {contactInfo.email}
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-xs italic leading-relaxed text-text-muted">
              {contactInfo.whatsappNotice}
            </div>

            <div className="mt-6">
              <WhatsAppButton variant="inline" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
