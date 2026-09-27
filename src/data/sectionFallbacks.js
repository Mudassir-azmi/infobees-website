// Minimal text-only copy of the editable sections, shown only on a first
// visit before the API responds, or if it is unreachable. The real content
// (images, service offerings...) lives in the database.

export const sectionFallbacks = {
  services: {
    key: "services",
    eyebrow: "What We Do",
    title: "Our Expertise",
    subtitle: "Integrated academic, research, technology and digital solutions under one roof.",
    content: {},
    items: [
      {
        id: "academic-research",
        slug: "academic-research",
        icon: "FaChalkboardTeacher",
        title: "Academic & Research",
        description:
          "Research mentorship, university guidance, academic writing and higher education advisory.",
      },
      {
        id: "software-digital-development",
        slug: "software-digital-development",
        icon: "FaLaptopCode",
        title: "Software & Digital Development",
        description: "Websites, mobile applications, desktop applications, UI/UX and cloud deployment.",
      },
      {
        id: "digital-civic-business-services",
        slug: "digital-civic-business-services",
        icon: "FaLandmark",
        title: "Digital Civic & Business Services",
        description:
          "G2C facilitation, banking/AePS assistance, ID card printing and document services.",
      },
      {
        id: "micro-fabrication-studio",
        slug: "micro-fabrication-studio",
        icon: "FaCubes",
        title: "Micro-Fabrication Studio",
        description: "Screen protection, custom merchandise, 3D printing and rapid prototyping.",
      },
      {
        id: "it-hardware-custom-pcs",
        slug: "it-hardware-custom-pcs",
        icon: "FaDesktop",
        title: "IT Hardware & Custom PCs",
        description: "Custom PC builds, accessories, diagnostics, maintenance and upgrades.",
      },
    ],
  },

  // One item per leader: title = name, subtitle = role, points = credentials,
  // note = highlight label, description = highlight text.
  about: {
    key: "about",
    eyebrow: "Leadership",
    title: "Academic Leadership",
    content: {},
    items: [
      {
        id: "founder",
        title: "Dr. Fakhre Alam",
        subtitle: "Founder, Infobees",
        points: [
          "Ph.D. — University of Delhi",
          "Master's Degree — University of Delhi",
          "Graduation — Jamia Millia Islamia, Delhi",
        ],
        note: "Value proposition",
        description:
          "Ethical guidance, institutional insight, academic rigor, and research methodology advisory.",
      },
    ],
  },

  why: {
    key: "why",
    eyebrow: "Our Difference",
    title: "Why Choose Infobees",
    content: {},
    items: [
      {
        id: "integrated",
        icon: "FaHandshake",
        title: "Integrated Expertise",
        description: "Academic, research and technology services under one organization.",
      },
      {
        id: "practical",
        icon: "FaLightbulb",
        title: "Practical Guidance",
        description: "Focused on useful, actionable solutions rather than unnecessary complexity.",
      },
      {
        id: "personalized",
        icon: "FaUserCheck",
        title: "Personalized Advisory",
        description: "Solutions tailored to individual academic and business requirements.",
      },
    ],
  },

  // One item per person: title = name, subtitle = role, data = { phone, whatsapp, email, address }.
  contact: {
    key: "contact",
    eyebrow: "Get In Touch",
    title: "Let's Discuss Your Requirement",
    subtitle: "Tell us what you need and the Infobees team will get back to you.",
    content: {
      whatsapp_notice:
        "WhatsApp communication is strictly text chat only. Voice calls are not entertained.",
    },
    items: [
      {
        id: "founder",
        title: "Dr. Fakhre Alam",
        subtitle: "Founder, Infobees",
        data: {
          phone: "+91 7982136067",
          whatsapp: "+91 7982136067",
          email: "fakarealam1@gmail.com",
        },
      },
    ],
  },

  // Footer social icons: title = label, link = profile URL, icon.
  social: {
    key: "social",
    title: "Follow Us",
    content: {},
    items: [],
  },
};
