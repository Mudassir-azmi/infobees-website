import { FaArrowLeft, FaCheckCircle, FaExternalLinkAlt, FaWhatsapp } from "react-icons/fa";
import { Link, useParams } from "react-router";
import DynamicIcon from "../components/DynamicIcon";
import SectionHeader from "../components/SectionHeader";
import ServiceGrid from "../components/ServiceGrid";
import Spinner from "../components/Spinner";
import { useSection, useSiteContentLoaded } from "../context/siteContent";
import { optimizeImage } from "../lib/cloudinary";
import { whatsappLink } from "../lib/contact";
import { resolveIcon } from "../lib/icons";
import { useSeo } from "../lib/seo";
import { serviceSlug } from "../lib/slugify";
import { serviceSchema } from "../lib/structuredData";

const toOfferingCard = (offering, index) => ({
  id: `${index}-${offering.title}`,
  icon: resolveIcon(offering.icon),
  title: offering.title,
  description: offering.description || undefined,
  points: offering.points?.length ? offering.points : undefined,
  note: offering.note || undefined,
});

function ServiceDetailPage() {
  const { slug } = useParams();
  const services = useSection("services").items;
  const contact = useSection("contact");
  const loaded = useSiteContentLoaded();
  const service = services.find((item) => serviceSlug(item) === slug);

  useSeo({
    title: service?.title ?? (loaded ? "Service not found" : undefined),
    description: service?.description || service?.data?.overview,
    path: `/services/${slug}`,
    image: service?.image_url,
    noindex: loaded && !service,
    jsonLd: service ? serviceSchema(service) : undefined,
  });

  if (!service) {
    return (
      <>
        <div className="bg-gradient-navy pt-24 pb-10" />
        <section className="bg-bg-light px-4 py-20 text-center">
          {loaded ? (
            <>
              <h1 className="text-2xl font-bold text-navy">Service not found</h1>
              <p className="mt-2 text-sm text-text-muted">It may have been renamed or removed.</p>
              <Link
                to="/#services"
                className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light"
              >
                See our services
              </Link>
            </>
          ) : (
            <Spinner />
          )}
        </section>
      </>
    );
  }

  const { overview, offerings = [] } = service.data ?? {};
  const whatsapp = whatsappLink(
    contact.items,
    `Hello Infobees, I would like to know more about ${service.title}.`
  );
  const isExternalLink = /^https?:\/\//i.test(service.link ?? "");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-navy pt-28 pb-16 sm:pt-36 sm:pb-20">
        {service.image_url && (
          <img
            src={optimizeImage(service.image_url, 1600)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/80 to-navy/60" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/#services"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 transition-colors hover:text-gold"
          >
            <FaArrowLeft size={11} aria-hidden="true" /> Back to services
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gold text-navy shadow-lg">
              <DynamicIcon icon={service.icon} size={28} aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">{service.title}</h1>
              {service.description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300">
                  {service.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={{ pathname: "/", search: `?service=${serviceSlug(service)}`, hash: "#contact" }}
              className="rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy shadow-lg shadow-gold/20 transition-transform hover:-translate-y-0.5"
            >
              Enquire about this service
            </Link>
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                <FaWhatsapp size={16} aria-hidden="true" /> Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Overview + what's included ---------- */}
      {(overview || service.points?.length > 0 || service.note || service.link) && (
        <section className="bg-white py-16 sm:py-20">
          <div
            className={`mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:px-8 ${
              service.points?.length ? "lg:grid-cols-[3fr_2fr]" : ""
            }`}
          >
            <div>
              {overview && (
                <>
                  <h2 className="text-2xl font-bold text-navy">Overview</h2>
                  <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-text-dark">
                    {overview}
                  </p>
                </>
              )}
              {service.note && (
                <p className="mt-6 rounded-lg border border-gold/30 bg-gold/5 p-4 text-sm italic leading-relaxed text-text-muted">
                  {service.note}
                </p>
              )}
              {service.link && (
                <a
                  href={service.link}
                  {...(isExternalLink && { target: "_blank", rel: "noopener noreferrer" })}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-gold-dark"
                >
                  {service.data?.link_label || "Learn more"}
                  {isExternalLink ? (
                    <FaExternalLinkAlt size={11} aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">&rarr;</span>
                  )}
                </a>
              )}
            </div>

            {service.points?.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-bg-light p-6">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  What&apos;s included
                </p>
                <ul className="space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-text-dark">
                      <FaCheckCircle className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------- Offerings ---------- */}
      {offerings.length > 0 && (
        <section className="bg-bg-light py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="What We Offer" title={`${service.title} Services`} />
            <ServiceGrid
              items={offerings.map(toOfferingCard)}
              columns={offerings.length === 4 ? 4 : 3}
            />
          </div>
        </section>
      )}
    </>
  );
}

export default ServiceDetailPage;
