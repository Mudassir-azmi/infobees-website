import { FaAddressBook, FaShareAlt, FaStar, FaThLarge, FaUsers } from "react-icons/fa";
import { SOCIAL_PLATFORMS } from "./social";

/**
 * Describes what the admin can edit for each website section.
 *
 * - image:          section-level image (null = section has no image)
 * - placeholders:   example text for the eyebrow / title / subtitle inputs
 * - contentFields:  section-specific fields stored in `site_sections.content`
 *                   type: "text" (default) | "textarea" | "icon" | "list"
 * - items.fields:   which optional fields each item uses, besides title:
 *                   "icon" | "image" | "subtitle" | "description" | "points" | "note" | "link"
 * - items.required: optional fields that must be filled in
 * - items.dataFields: extra fields stored in the item's `data`
 *                   (type: "text" (default) | "email" | "textarea" | "select")
 * - items.iconFromData(data): sets the item icon from its data (e.g. platform)
 * - items.defaultTitle(data): title used when the title field is left empty
 * - items.fieldLabels / fieldHints / fieldPlaceholders: per-section wording
 * - items.editorPath: items are edited on their own page instead of a popup
 */
export const ADMIN_SECTIONS = [
  {
    key: "services",
    label: "Services",
    icon: FaThLarge,
    description: "Your services: the cards on the home page and each service's own page.",
    image: null,
    placeholders: { eyebrow: "e.g. What We Do", title: "e.g. Our Expertise" },
    contentFields: [],
    items: {
      label: "service",
      plural: "Services",
      editorPath: "/admin/sections/services",
    },
  },
  {
    key: "about",
    label: "Leadership",
    icon: FaUsers,
    description: "The About section: founders and leaders, with photos and credentials.",
    image: null,
    placeholders: { eyebrow: "e.g. Leadership", title: "e.g. Academic Leadership" },
    contentFields: [],
    items: {
      label: "leader",
      plural: "Leaders",
      fields: ["subtitle", "image", "points", "note", "description"],
      fieldLabels: {
        title: "Name",
        subtitle: "Role / position",
        image: "Photo",
        points: "Credentials",
        note: "Highlight label",
        description: "Highlight text",
      },
      fieldHints: {
        image: "Square photos work best.",
        points: "One credential per line.",
        note: "Bold label shown before the highlight text.",
        description: "Short statement shown under the credentials.",
      },
      fieldPlaceholders: {
        title: "e.g. Dr. Jane Doe",
        subtitle: "e.g. Co-founder & Director",
        points: "e.g. Ph.D. — University of Delhi\nMaster's Degree — Jamia Millia Islamia\nPGDCA",
        note: "e.g. Value proposition",
        description: "e.g. Ethical guidance, institutional insight and academic rigor.",
      },
    },
  },
  {
    key: "why",
    label: "Why Choose Us",
    icon: FaStar,
    description: 'The "Why Choose Infobees" cards on the home page.',
    image: null,
    placeholders: { eyebrow: "e.g. Our Difference", title: "e.g. Why Choose Infobees" },
    contentFields: [],
    items: {
      label: "reason",
      plural: "Reasons",
      fields: ["icon", "description"],
      fieldPlaceholders: {
        title: "e.g. Personalized Advisory",
        description: "e.g. Solutions tailored to individual academic and business requirements.",
      },
    },
  },
  {
    key: "contact",
    label: "Contact",
    icon: FaAddressBook,
    description:
      "Contact persons shown in the Contact section and footer, each with their own phone, WhatsApp, email and address.",
    image: null,
    placeholders: {
      eyebrow: "e.g. Get In Touch",
      title: "e.g. Let's Discuss Your Requirement",
    },
    contentFields: [
      {
        name: "whatsapp_notice",
        label: "WhatsApp notice",
        type: "textarea",
        hint: "Shown under the contact details when someone has a WhatsApp number.",
        placeholder: "e.g. WhatsApp is text chat only.",
      },
    ],
    items: {
      label: "contact person",
      plural: "Contact persons",
      fields: ["subtitle"],
      // Each person's details, stored in item.data. All optional.
      dataFields: [
        { name: "phone", label: "Phone", placeholder: "e.g. +91 98765 43210" },
        {
          name: "whatsapp",
          label: "WhatsApp",
          placeholder: "e.g. +91 98765 43210",
          hint: "With country code. The first person's WhatsApp is used for the website's WhatsApp buttons.",
        },
        { name: "email", label: "Email", type: "email", placeholder: "e.g. name@example.com" },
        { name: "address", label: "Address", type: "textarea", placeholder: "Full postal address" },
      ],
      fieldLabels: { title: "Name", subtitle: "Role / department" },
      fieldPlaceholders: { title: "e.g. Dr. Jane Doe", subtitle: "e.g. Admissions Head" },
    },
  },
  {
    key: "social",
    label: "Social Links",
    icon: FaShareAlt,
    description: "Facebook, Instagram, LinkedIn and other profiles, shown as icons in the footer.",
    image: null,
    placeholders: { title: "e.g. Follow Us" },
    contentFields: [],
    items: {
      label: "social link",
      plural: "Social links",
      fields: ["link"],
      required: ["link"],
      dataFields: [
        {
          name: "platform",
          label: "Platform",
          type: "select",
          defaultValue: "instagram",
          options: Object.entries(SOCIAL_PLATFORMS).map(([value, p]) => ({ value, label: p.label })),
        },
      ],
      // Icon follows the platform; an empty label becomes the platform name.
      iconFromData: (data) => SOCIAL_PLATFORMS[data.platform]?.icon,
      defaultTitle: (data) => SOCIAL_PLATFORMS[data.platform]?.label,
      fieldLabels: { title: "Label (optional)", link: "Profile URL *" },
      fieldHints: {
        title: "Shown when hovering the icon. Leave empty to use the platform name.",
        link: "The full address of your profile page.",
      },
      fieldPlaceholders: { title: "e.g. Instagram", link: "https://instagram.com/infobees" },
    },
  },
];

export function getAdminSectionConfig(key) {
  return ADMIN_SECTIONS.find((section) => section.key === key);
}
