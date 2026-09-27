import { Link } from "react-router";
import beeLogo from "../assets/images/logo/bee.svg";
import { useSection, useVisibleLinks } from "../context/siteContent";
import { footerCompanyLinks } from "../data/site";
import { serviceSlug } from "../lib/slugify";
import ContactPerson from "./ContactPerson";
import SectionLink from "./SectionLink";
import SocialLinks from "./SocialLinks";

function Footer() {
  const services = useSection("services").items;
  const persons = useSection("contact").items;
  const companyLinks = useVisibleLinks(footerCompanyLinks);

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
              Integrated academic advisory, research consulting, software development, digital
              services and IT solutions.
            </p>

            <SocialLinks showTitle className="mt-6" />
          </div>

          {services.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Services</h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((service) => (
                <li key={service.id}>
                  <Link to={`/services/${serviceSlug(service)}`} className="transition-colors hover:text-gold">
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          )}

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  {link.to ? (
                    <Link to={link.to} className="transition-colors hover:text-gold">
                      {link.label}
                    </Link>
                  ) : (
                    <SectionLink anchor={link.anchor} className="transition-colors hover:text-gold">
                      {link.label}
                    </SectionLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {persons.length > 0 && (
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
            <div className="space-y-5">
              {persons.map((person) => (
                <ContactPerson key={person.id} person={person} variant="dark" />
              ))}
            </div>
          </div>
          )}
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Infobees. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
