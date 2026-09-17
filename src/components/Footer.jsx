import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import beeLogo from "../assets/images/logo/bee.svg";
import {
  contactInfo,
  footerCompanyLinks,
  footerServiceLinks,
} from "../data/services";

function Footer() {
  return (
    <footer className="bg-gradient-navy pt-16 pb-8 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={beeLogo} alt="" aria-hidden="true" className="h-9 w-9" />
              <span className="text-lg font-bold tracking-tight text-white">
                Info<span className="text-gold">bees</span>
              </span>
            </div>
            <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-gold">
              Academic, Research and IT Solutions
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Integrated academic advisory, research consulting, software
              development, digital services, fabrication and IT solutions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerServiceLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.anchor} className="transition-colors hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerCompanyLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.anchor} className="transition-colors hover:text-gold">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>{contactInfo.founderName}</li>
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-gold" aria-hidden="true" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-gold">
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-gold" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-gold">
                  {contactInfo.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs italic leading-relaxed text-slate-400">
              {contactInfo.whatsappNotice}
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          &copy; 2026 Infobees. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
