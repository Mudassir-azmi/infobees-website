import { useEffect, useState } from "react";
import {
  FaBars,
  FaBullhorn,
  FaExternalLinkAlt,
  FaInbox,
  FaSignOutAlt,
  FaTachometerAlt,
  FaTimes,
} from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from "react-router";
import beeLogo from "../../assets/images/logo/bee.svg";
import { clearAdminSession } from "../../lib/adminAuth";
import { ADMIN_SECTIONS } from "../../lib/adminSections";
import { fetchEnquiryStats } from "../../lib/enquiries";

const NAV_GROUPS = [
  {
    title: "Overview",
    links: [{ to: "/admin/dashboard", label: "Dashboard", icon: FaTachometerAlt }],
  },
  {
    title: "Content",
    links: [
      { to: "/admin/enquiries", label: "Enquiries", icon: FaInbox, badge: "newEnquiries" },
      { to: "/admin/notices", label: "Notices", icon: FaBullhorn },
    ],
  },
  {
    title: "Website",
    links: ADMIN_SECTIONS.map((section) => ({
      to: `/admin/sections/${section.key}`,
      label: section.label,
      icon: section.icon,
    })),
  },
];

function SidebarContent({ admin, onLogout, badges }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin/dashboard" className="flex h-16 shrink-0 items-center gap-2.5 px-6">
        <img src={beeLogo} alt="" aria-hidden="true" className="h-9 w-9" />
        <span className="text-lg font-bold tracking-tight text-white">
          Info<span className="text-gold">bees</span>
        </span>
        <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
          Admin
        </span>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Admin">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.links.map(({ to, label, icon: Icon, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-white/10 text-gold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`
                    }
                  >
                    <Icon size={14} aria-hidden="true" className="shrink-0" />
                    {label}
                    {badges?.[badge] > 0 && (
                      <span
                        className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy"
                        aria-label={`${badges[badge]} new`}
                      >
                        {badges[badge]}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 text-sm text-slate-300 transition-colors hover:text-gold"
        >
          <FaExternalLinkAlt size={11} aria-hidden="true" /> View website
        </a>
        <div className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{admin.name}</p>
            <p className="truncate text-xs text-slate-400">{admin.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
            className="rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <FaSignOutAlt aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLayout({ admin, children }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [badges, setBadges] = useState({});

  // "New enquiries" badge: on load, every minute, and after changes on the Enquiries page.
  useEffect(() => {
    const refresh = () =>
      fetchEnquiryStats()
        .then((res) => setBadges({ newEnquiries: res.data.new }))
        .catch(() => {});
    refresh();
    const interval = setInterval(refresh, 60_000);
    window.addEventListener("enquiries-changed", refresh);
    return () => {
      clearInterval(interval);
      window.removeEventListener("enquiries-changed", refresh);
    };
  }, []);

  // Close the mobile drawer after navigating.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const logout = () => {
    clearAdminSession();
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-gradient-navy lg:block">
        <SidebarContent admin={admin} onLogout={logout} badges={badges} />
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-gradient-navy px-4 shadow lg:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-2 text-white"
        >
          <FaBars size={18} />
        </button>
        <span className="text-base font-bold text-white">
          Info<span className="text-gold">bees</span> Admin
        </span>
        <button
          type="button"
          onClick={logout}
          aria-label="Logout"
          className="rounded-md p-2 text-slate-300 hover:text-gold"
        >
          <FaSignOutAlt />
        </button>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-navy-deep/60" onClick={() => setDrawerOpen(false)} />
          <aside className="relative h-full w-72 max-w-[85%] animate-fade-in bg-gradient-navy shadow-2xl">
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 rounded-md p-2 text-slate-300 hover:text-white"
            >
              <FaTimes />
            </button>
            <SidebarContent admin={admin} onLogout={logout} badges={badges} />
          </aside>
        </div>
      )}

      <main className="px-4 py-8 sm:px-6 lg:ml-64 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
