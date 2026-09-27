import ContactForm from "../components/ContactForm";
import ContactPerson from "../components/ContactPerson";
import SectionHeader from "../components/SectionHeader";
import WhatsAppButton from "../components/WhatsAppButton";
import { useSection } from "../context/siteContent";

function ContactSection() {
  const section = useSection("contact");
  const persons = section.items;
  const whatsappNotice = section.content?.whatsapp_notice;
  const hasWhatsapp = persons.some((person) => person.data?.whatsapp);

  return (
    <section id="contact" className="bg-bg-light py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle} />

        <div
          className={`mx-auto grid grid-cols-1 gap-10 ${
            persons.length ? "max-w-5xl lg:grid-cols-[1fr_1.3fr]" : "max-w-2xl"
          }`}
        >
          {persons.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h3 className="mb-6 text-lg font-semibold text-navy">Contact Details</h3>

            <div className="divide-y divide-slate-100">
              {persons.map((person) => (
                <div key={person.id} className="py-5 first:pt-0 last:pb-0">
                  <ContactPerson person={person} />
                </div>
              ))}
            </div>

            {hasWhatsapp && whatsappNotice && (
              <div className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-xs italic leading-relaxed text-text-muted">
                {whatsappNotice}
              </div>
            )}

            {hasWhatsapp && (
              <div className="mt-6">
                <WhatsAppButton variant="inline" />
              </div>
            )}
          </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
