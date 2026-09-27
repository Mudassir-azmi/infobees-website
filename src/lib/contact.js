import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const DEFAULT_COUNTRY_CODE = "91"; // India

/** Digits for wa.me links; a bare 10-digit number gets the default country code. */
export function whatsappDigits(value = "") {
  const digits = value.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length === 10 ? DEFAULT_COUNTRY_CODE + digits : digits;
}

/**
 * The details a contact person can have (stored in item.data), in display
 * order, with how each one is shown and linked.
 */
export const CONTACT_FIELDS = [
  {
    key: "phone",
    label: "Phone",
    icon: FaPhoneAlt,
    href: (value) => {
      const number = value.replace(/[^\d+]/g, "");
      return `tel:${number.startsWith("+") ? number : `+${whatsappDigits(number)}`}`;
    },
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: FaWhatsapp,
    external: true,
    href: (value) => `https://wa.me/${whatsappDigits(value)}`,
  },
  {
    key: "email",
    label: "Email",
    icon: FaEnvelope,
    href: (value) => `mailto:${value}`,
  },
  {
    key: "address",
    label: "Address",
    icon: FaMapMarkerAlt,
    external: true,
    href: (value) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`,
  },
];

/** A person's filled-in details: [{ key, label, icon, href, value }]. */
export function personDetails(person) {
  return CONTACT_FIELDS.filter((field) => person.data?.[field.key]).map((field) => ({
    ...field,
    value: person.data[field.key],
  }));
}

/** wa.me link for the first person with WhatsApp, with an optional prefilled message. */
export function whatsappLink(persons, message) {
  const number = persons.find((person) => person.data?.whatsapp)?.data.whatsapp;
  if (!number) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${whatsappDigits(number)}${text}`;
}
