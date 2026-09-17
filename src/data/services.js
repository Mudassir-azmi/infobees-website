import {
  FaChalkboardTeacher,
  FaLaptopCode,
  FaLandmark,
  FaCubes,
  FaDesktop,
  FaGraduationCap,
  FaBookOpen,
  FaAward,
  FaCompass,
  FaPenNib,
  FaGlobe,
  FaMobileAlt,
  FaWindows,
  FaCloud,
  FaIdCard,
  FaMoneyCheckAlt,
  FaFileAlt,
  FaMobile,
  FaTshirt,
  FaCube,
  FaMicrochip,
  FaPlug,
  FaFan,
  FaTools,
  FaLightbulb,
  FaHandshake,
  FaUserCheck,
  FaHeadset,
} from "react-icons/fa";

import academicImg from "../assets/images/services/academic-research.jpg";
import softwareImg from "../assets/images/services/software-development.jpg";
import civicImg from "../assets/images/services/civic-services.jpg";
import fabricationImg from "../assets/images/services/fabrication-studio.jpg";
import hardwareImg from "../assets/images/services/it-hardware.jpg";

// ---------- Hero trust indicators ----------
export const trustIndicators = [
  "Academic Expertise",
  "Research Guidance",
  "Software Development",
  "IT Solutions",
];

// ---------- Section 6: Our Expertise overview cards ----------
export const overviewServices = [
  {
    id: "academic-research",
    icon: FaChalkboardTeacher,
    image: academicImg,
    title: "Academic & Research",
    description:
      "Research mentorship, university guidance, academic writing and higher education advisory.",
    anchor: "#academic",
  },
  {
    id: "software-digital",
    icon: FaLaptopCode,
    image: softwareImg,
    title: "Software & Digital Development",
    description:
      "Websites, mobile applications, desktop applications, UI/UX and cloud deployment.",
    anchor: "#technology",
  },
  {
    id: "civic-business",
    icon: FaLandmark,
    image: civicImg,
    title: "Digital Civic & Business Services",
    description:
      "G2C facilitation, banking/AePS assistance, ID card printing and document services.",
    anchor: "#civic-services",
  },
  {
    id: "micro-fabrication",
    icon: FaCubes,
    image: fabricationImg,
    title: "Micro-Fabrication Studio",
    description:
      "Screen protection, custom merchandise, 3D printing and rapid prototyping.",
    anchor: "#fabrication",
  },
  {
    id: "it-hardware",
    icon: FaDesktop,
    image: hardwareImg,
    title: "IT Hardware & Custom PCs",
    description:
      "Custom PC builds, accessories, diagnostics, maintenance and upgrades.",
    anchor: "#hardware",
  },
];

// Section banner images (used as side visuals in section intros)
export const sectionImages = {
  academic: academicImg,
  software: softwareImg,
  civic: civicImg,
  fabrication: fabricationImg,
  hardware: hardwareImg,
};

// ---------- Section 7: Founder credentials ----------
export const founderCredentials = [
  "Ph.D. — University of Delhi",
  "Master's Degree — University of Delhi",
  "Graduation — Jamia Millia Islamia, Delhi",
  "Advanced Creative Writing — Bharatiya Vidya Bhavan, Delhi",
  "Academic Writing Certificate Courses — SWAYAM (Garhwal University)",
  "Postgraduate Diploma in Computer Applications (PGDCA)",
];

// ---------- Section 8: Academic & Research Consulting ----------
export const academicServices = [
  {
    id: "admission-guidance",
    icon: FaGraduationCap,
    title: "Central University & CUET Admission Guidance",
    points: [
      "UG admission guidance",
      "PG admission guidance",
      "PhD roadmap",
      "University selection",
      "Application guidance",
    ],
  },
  {
    id: "manuscript-support",
    icon: FaBookOpen,
    title: "Research & Manuscript Support",
    points: [
      "Research manuscript editing",
      "Thesis formatting",
      "Academic writing support",
      "Plagiarism review advisory",
      "Research methodology guidance",
    ],
    note: "Infobees does not provide plagiarism removal or guarantee acceptance/publication.",
  },
  {
    id: "fellowship-navigation",
    icon: FaAward,
    title: "Fellowship & Scholarship Navigation",
    points: [
      "UGC-NET/JRF",
      "CSIR",
      "ICSSR",
      "Institutional grants",
      "Scholarship navigation",
    ],
    note: "Guidance only — selection is not guaranteed.",
  },
  {
    id: "academic-direction",
    icon: FaCompass,
    title: "Academic Direction",
    points: [
      "Course suitability",
      "Discipline selection",
      "Institutional quality evaluation",
      "Academic planning",
    ],
  },
  {
    id: "academic-content",
    icon: FaPenNib,
    title: "Academic & Creative Content",
    points: [
      "Academic content writing",
      "Creative writing",
      "Editing",
      "Formatting",
      "Research-oriented content support",
    ],
    note: "For guidance and support only — not a substitute for personal graded work.",
  },
];

// ---------- Section 9: Software & Digital Development ----------
export const softwareCategories = [
  {
    id: "website-development",
    icon: FaGlobe,
    title: "Website Development",
    points: [
      "Responsive corporate websites",
      "E-commerce stores",
      "Portfolio websites",
      "Educational websites",
      "CMS platforms",
      "Business portals",
    ],
  },
  {
    id: "mobile-development",
    icon: FaMobileAlt,
    title: "Mobile Application Development",
    points: [
      "Android applications",
      "iOS applications",
      "Cross-platform applications",
      "Business applications",
      "Utility applications",
      "Booking applications",
      "Institutional applications",
    ],
  },
  {
    id: "desktop-development",
    icon: FaWindows,
    title: "Desktop / PC Application Development",
    points: [
      "Windows applications",
      "macOS applications",
      "Standalone software",
      "Productivity tools",
      "Local database utilities",
      "Custom business software",
    ],
  },
];

export const additionalTechServices = [
  "UI/UX design",
  "Cloud deployment",
  "Website maintenance",
  "Application maintenance",
  "Technical support",
];

export const additionalTechIcon = FaCloud;

// ---------- Section 10: Digital Civic & Business Services ----------
export const civicServices = [
  {
    id: "g2c-services",
    icon: FaLandmark,
    title: "Government-to-Citizen Services",
    description:
      "G2C and civic facilitation services for everyday digital requirements.",
  },
  {
    id: "banking-aeps",
    icon: FaMoneyCheckAlt,
    title: "Banking & AePS Facilitation",
    points: [
      "Biometric cash withdrawal",
      "Mini statements",
      "Banking transaction facilitation",
    ],
    note: "Infobees facilitates AePS-based banking transactions and is not a bank.",
  },
  {
    id: "id-card-printing",
    icon: FaIdCard,
    title: "Smart PVC ID Card Printing",
    points: ["Aadhaar", "Ayushman", "Voter IDs", "School IDs", "Corporate badges"],
    note: "PVC printing service only — not an official government-issued replacement document.",
  },
  {
    id: "document-services",
    icon: FaFileAlt,
    title: "Document Services",
    points: [
      "High-grade lamination",
      "Document reproduction",
      "Archival reproduction",
    ],
  },
];

// ---------- Section 11: Micro-Fabrication Studio ----------
export const fabricationServices = [
  {
    id: "screen-protection",
    icon: FaMobile,
    title: "Screen Protection & Custom Wraps",
    points: [
      "Hydrogel screen protection",
      "Clear",
      "Matte",
      "Anti-Peep Privacy",
      "Custom phone wraps",
    ],
  },
  {
    id: "custom-sublimation",
    icon: FaTshirt,
    title: "Custom Sublimation",
    points: [
      "Corporate ceramic mugs",
      "Personalized phone cases",
      "Customized apparel",
      "Promotional merchandise",
    ],
  },
  {
    id: "3d-printing",
    icon: FaCube,
    title: "3D Printing & Rapid Prototyping",
    points: [
      "Chassis",
      "Brackets",
      "Desktop docks",
      "Structural patterns",
      "Custom prototypes",
    ],
  },
];

// ---------- Section 12: IT Hardware & Custom PC Builds ----------
export const hardwareServices = [
  {
    id: "custom-desktops",
    icon: FaDesktop,
    title: "Custom Desktop Computing",
    points: [
      "Office PCs",
      "Academic Mini PCs",
      "High-performance creator workstations",
      "Custom configurations",
    ],
  },
  {
    id: "retail-electronics",
    icon: FaPlug,
    title: "Retail Electronics",
    points: [
      "GaN wall chargers",
      "33W chargers",
      "65W chargers",
      "Reinforced data cables",
      "Multi-port USB-C hubs",
      "Audio DAC adapters",
    ],
  },
  {
    id: "usb-peripherals",
    icon: FaMicrochip,
    title: "Custom USB Desktop Peripherals",
    points: [
      "Monitor task lights",
      "Silent cooling fans",
      "Ambient acrylic branding displays",
      "5V USB accessories",
    ],
  },
  {
    id: "hardware-services",
    icon: FaTools,
    title: "Hardware Services",
    points: [
      "Hardware diagnostics",
      "Thermal maintenance",
      "PC upgrades",
      "Performance optimization",
    ],
    note: "Certification from manufacturers is not implied unless separately provided.",
  },
];

// ---------- Section 13: Why Infobees ----------
export const whyInfobees = [
  {
    icon: FaHandshake,
    title: "Integrated Expertise",
    description:
      "Academic, research and technology services under one organization.",
  },
  {
    icon: FaLightbulb,
    title: "Practical Guidance",
    description:
      "Focused on useful, actionable solutions rather than unnecessary complexity.",
  },
  {
    icon: FaUserCheck,
    title: "Personalized Advisory",
    description:
      "Solutions tailored to individual academic and business requirements.",
  },
  {
    icon: FaLaptopCode,
    title: "Technology Driven",
    description: "Modern software, hardware and digital solutions.",
  },
  {
    icon: FaAward,
    title: "Professional Approach",
    description:
      "Clear communication, structured processes and transparent service scope.",
  },
  {
    icon: FaHeadset,
    title: "Long-Term Support",
    description:
      "Technical maintenance and continued assistance where applicable.",
  },
];

// ---------- Contact form service options ----------
export const inquiryServiceOptions = [
  "Academic Mentorship / University Guidance",
  "Research & Manuscript Editing",
  "Website & Mobile/PC App Development",
  "Custom PC Build / IT Hardware",
  "Bulk Printing / Sublimation Merchandise",
  "Other",
];

// ---------- Contact information ----------
export const contactInfo = {
  founderName: "Dr. Fakhre Alam",
  phone: "+91 7982136067",
  whatsappNumber: "917982136067",
  email: "fakarealam1@gmail.com",
  whatsappNotice:
    "WhatsApp communication is strictly text chat only. Voice calls are not entertained.",
};

// ---------- Footer link columns ----------
export const footerServiceLinks = [
  { label: "Academic & Research", anchor: "#academic" },
  { label: "Software Development", anchor: "#technology" },
  { label: "Digital Services", anchor: "#civic-services" },
  { label: "Micro-Fabrication", anchor: "#fabrication" },
  { label: "IT Hardware", anchor: "#hardware" },
];

export const footerCompanyLinks = [
  { label: "About", anchor: "#about" },
  { label: "Founder", anchor: "#about" },
  { label: "Contact", anchor: "#contact" },
];

// ---------- Navbar links ----------
export const navLinks = [
  { label: "Services", anchor: "#services" },
  { label: "About", anchor: "#about" },
  { label: "Academic", anchor: "#academic" },
  { label: "Technology", anchor: "#technology" },
  { label: "Contact", anchor: "#contact" },
];
