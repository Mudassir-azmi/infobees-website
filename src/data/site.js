// Static site navigation. Everything else (services, leadership, why us,
// contact details) comes from the database via useSection().

export const trustIndicators = [
  "Academic Expertise",
  "Research Guidance",
  "Software Development",
  "IT Solutions",
];

// `anchor` = section on the home page, `to` = separate page.
// `section` = hide the link while that section has no visible items
// (the section isn't rendered then, so the link would go nowhere).
// Keep the same order as the sections on the home page (see HomePage.jsx).
export const navLinks = [
  { label: "Notices", anchor: "#notices" },
  { label: "Services", anchor: "#services" },
  { label: "About", anchor: "#about", section: "about" },
  { label: "Why Us", anchor: "#why", section: "why" },
  { label: "Contact", anchor: "#contact" },
];

export const footerCompanyLinks = [
  { label: "Notices", anchor: "#notices" },
  { label: "Services", anchor: "#services" },
  { label: "About", anchor: "#about", section: "about" },
  { label: "Why Us", anchor: "#why", section: "why" },
  { label: "Contact", anchor: "#contact" },
  { label: "All Notices", to: "/notices" },
];
