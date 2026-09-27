import { optimizeImage } from "./cloudinary";
import { SITE_NAME, SITE_URL } from "./seo";
import { serviceSlug } from "./slugify";

/**
 * schema.org data for Google (business info + services), built from the
 * live Contact, Services and Social Links content.
 */
export function organizationSchema({ services = [], persons = [], social = [] }) {
  const main = persons.find((p) => p.data?.phone || p.data?.email) ?? persons[0];
  const address = persons.find((p) => p.data?.address)?.data.address;

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og-image.png`,
    description:
      "Academic mentorship, research consulting, higher education guidance, software development, digital services and IT solutions.",
    ...(main?.data?.phone && { telephone: main.data.phone }),
    ...(main?.data?.email && { email: main.data.email }),
    ...(address && { address }),
    ...(social.length && { sameAs: social.map((s) => s.link) }),
    ...(services.length && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((service) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: service.title,
            url: `${SITE_URL}/services/${serviceSlug(service)}`,
          },
        })),
      },
    }),
  };
}

export function serviceSchema(service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description || service.data?.overview || undefined,
    url: `${SITE_URL}/services/${serviceSlug(service)}`,
    ...(service.image_url && { image: optimizeImage(service.image_url, 1200) }),
    provider: { "@type": "ProfessionalService", name: SITE_NAME, url: `${SITE_URL}/` },
    ...(service.data?.offerings?.length && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: service.title,
        itemListElement: service.data.offerings.map((o) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: o.title },
        })),
      },
    }),
  };
}

export function noticeSchema(notice) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: notice.title,
    description: notice.summary || notice.description?.slice(0, 200),
    datePublished: notice.created_at,
    dateModified: notice.updated_at || notice.created_at,
    url: `${SITE_URL}/notices/${notice.slug}`,
    ...(notice.image_url && { image: optimizeImage(notice.image_url, 1200) }),
    publisher: { "@type": "Organization", name: SITE_NAME, logo: `${SITE_URL}/favicon.svg` },
  };
}
