import { FaWhatsapp } from "react-icons/fa";
import { useSection } from "../context/siteContent";
import { whatsappLink } from "../lib/contact";

const DEFAULT_MESSAGE = "Hello Infobees, I would like to know more about your services.";

/** Uses the first WhatsApp number from the Contact section; hidden if there is none. */
function WhatsAppButton({ variant = "floating", message = DEFAULT_MESSAGE }) {
  const contact = useSection("contact");
  const link = whatsappLink(contact.items, message);
  if (!link) return null;

  if (variant === "inline") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
      >
        <FaWhatsapp size={18} aria-hidden="true" />
        Chat on WhatsApp
      </a>
    );
  }

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Infobees on WhatsApp"
      className="animate-pulse-ring fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <FaWhatsapp size={26} aria-hidden="true" />
    </a>
  );
}

export default WhatsAppButton;
