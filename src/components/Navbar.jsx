import { useEffect, useState } from "react";
import {
  FaBars,
  FaBullhorn,
  FaEnvelope,
  FaStar,
  FaThLarge,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { Link, useLocation } from "react-router";
import beeLogo from "../assets/images/logo/bee.svg";
import { useVisibleLinks } from "../context/siteContent";
import { navLinks } from "../data/site";
import SectionLink from "./SectionLink";

const NAV_ICONS = {
  "#services": FaThLarge,
  "#about": FaUserGraduate,
  "#why": FaStar,
  "#notices": FaBullhorn,
  "#contact": FaEnvelope,
};

const linkKey = (link) => link.to ?? link.anchor;

/** Renders a nav item as a route link (`to`) or a home-section link (`anchor`). */
function NavItem({ link, className, onClick, children }) {
  if (link.to) {
    return (
      <Link to={link.to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <SectionLink anchor={link.anchor} className={className} onClick={onClick}>
      {children}
    </SectionLink>
  );
}

function Navbar() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const links = useVisibleLinks(navLinks);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeAnchor, setActiveAnchor] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Highlight the home-page section currently in view.
  useEffect(() => {
    if (!isHome) return;

    const sections = navLinks
      .filter((link) => link.anchor)
      .map((link) => document.querySelector(link.anchor))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveAnchor(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setActiveAnchor("");
    };
  }, [isHome]);

  const isActive = (link) =>
    link.to ? pathname.startsWith(link.to) : isHome && activeAnchor === link.anchor;

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 flex justify-center transition-all duration-300 ${
        scrolled ? "px-0 sm:px-4 sm:pt-3" : "px-0"
      }`}
    >
      <nav
        className={`w-full bg-navy transition-all duration-300 ${
          scrolled
            ? "sm:max-w-5xl sm:rounded-full sm:border sm:border-white/10 sm:bg-navy/90 sm:shadow-xl sm:shadow-black/20 sm:backdrop-blur-md"
            : "sm:max-w-full"
        }`}
        aria-label="Primary"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <SectionLink anchor="#home" className="group flex items-center gap-2.5">
            <img
              src={beeLogo}
              alt=""
              aria-hidden="true"
              className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[18deg]"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              Info<span className="text-gold">bees</span>
            </span>
          </SectionLink>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <li key={linkKey(link)}>
                <NavItem
                  link={link}
                  className={`block rounded-full px-4 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-gold/60 ${
                    isActive(link) ? "text-gold" : "text-slate-200 hover:text-gold"
                  }`}
                >
                  {link.label}
                </NavItem>
              </li>
            ))}
          </ul>

          <SectionLink
            anchor="#contact"
            className="hidden rounded-full bg-gold-gradient bg-[length:200%_100%] bg-left px-5 py-2.5 text-sm font-semibold text-navy shadow-sm transition-all duration-300 hover:bg-right hover:shadow-md md:inline-block"
          >
            Book Advisory
          </SectionLink>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white md:hidden"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-white/10 bg-navy md:hidden">
            <ul className="flex flex-col gap-1 px-4 py-4">
              {links.map((link, index) => {
                const Icon = NAV_ICONS[linkKey(link)];
                return (
                  <li
                    key={linkKey(link)}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <NavItem
                      link={link}
                      onClick={closeMenu}
                      className={`flex items-center gap-3 rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-white/5 hover:text-gold ${
                        isActive(link) ? "text-gold" : "text-slate-200"
                      }`}
                    >
                      {Icon && <Icon size={16} aria-hidden="true" />}
                      {link.label}
                    </NavItem>

                  </li>
                );
              })}
              <li className="animate-fade-in pt-2" style={{ animationDelay: `${links.length * 60}ms` }}>
                <SectionLink
                  anchor="#contact"
                  onClick={closeMenu}
                  className="block rounded-full bg-gold px-4 py-3 text-center text-sm font-semibold text-navy"
                >
                  Book Advisory
                </SectionLink>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
