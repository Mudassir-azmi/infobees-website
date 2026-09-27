import { useEffect, useState } from "react";
import { FaBullhorn, FaEyeSlash, FaGlobe, FaInbox, FaPlus, FaThumbtack } from "react-icons/fa";
import { Link, useOutletContext } from "react-router";
import { ADMIN_SECTIONS } from "../../lib/adminSections";
import { formatDate } from "../../lib/format";
import { fetchAdminNotices, fetchAdminNoticeStats } from "../../lib/notices";
import { fetchEnquiryStats } from "../../lib/enquiries";
import { fetchAdminSections } from "../../lib/sections";

function SectionCards() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    fetchAdminSections()
      .then((res) =>
        setCounts(Object.fromEntries(res.data.map((s) => [s.key, s]))))
      .catch(() => {}); // tables not created yet: cards still link to the editor
  }, []);

  return (
    <div>
      <h2 className="mb-3 font-semibold text-navy">Website sections</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_SECTIONS.map(({ key, label, icon: Icon, description }) => (
          <Link
            key={key}
            to={`/admin/sections/${key}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold transition-colors group-hover:bg-gold group-hover:text-navy">
              <Icon size={16} aria-hidden="true" />
            </span>
            <p className="mt-3 font-semibold text-navy">{label}</p>
            <p className="mt-1 line-clamp-2 text-xs text-text-muted">{description}</p>
            {counts[key] && (
              <p className="mt-3 text-xs font-medium text-gold-dark">
                {counts[key].item_count} item(s) · updated {formatDate(counts[key].updated_at)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-muted">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-gold">
          <Icon size={15} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-navy">{value ?? "–"}</p>
    </div>
  );
}

function EnquiriesCard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchEnquiryStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  return (
    <Link
      to="/admin/enquiries"
      className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gold/30 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-navy">
          <FaInbox size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-medium text-text-muted">Contact form enquiries</p>
          <p className="text-2xl font-bold text-navy">
            {stats ? `${stats.new} new` : "–"}
            {stats && (
              <span className="ml-2 text-sm font-normal text-text-muted">
                · {stats.in_progress} in progress · {stats.total} total
              </span>
            )}
          </p>
        </div>
      </div>
      <span className="text-sm font-semibold text-navy">Open enquiries &rarr;</span>
    </Link>
  );
}

function AdminDashboard() {
  const { admin } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminNoticeStats(), fetchAdminNotices({ limit: 5 })])
      .then(([statsRes, listRes]) => {
        setStats(statsRes.data);
        setRecent(listRes.data);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Dashboard</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Welcome, {admin.name}</h1>
          <p className="mt-1 text-sm text-text-muted">{admin.email}</p>
        </div>
        <Link
          to="/admin/notices/new"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
        >
          <FaPlus size={12} aria-hidden="true" /> New notice
        </Link>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <EnquiriesCard />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total notices" value={stats?.total} icon={FaBullhorn} />
        <StatCard label="Published" value={stats?.published} icon={FaGlobe} />
        <StatCard label="Drafts" value={stats?.drafts} icon={FaEyeSlash} />
        <StatCard label="Pinned" value={stats?.pinned} icon={FaThumbtack} />
      </div>

      <SectionCards />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-semibold text-navy">Recent notices</h2>
          <Link to="/admin/notices" className="text-sm font-semibold text-navy hover:text-gold-dark">
            Manage all &rarr;
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-text-muted">
            No notices yet.{" "}
            <Link to="/admin/notices/new" className="font-semibold text-navy hover:text-gold-dark">
              Create the first one
            </Link>
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((notice) => (
              <li key={notice.id}>
                <Link
                  to={`/admin/notices/${notice.id}/edit`}
                  className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-bg-light"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy">{notice.title}</p>
                    <p className="text-xs text-text-muted">
                      {notice.topic ? `${notice.topic} · ` : ""}
                      {formatDate(notice.created_at)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      notice.is_published ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {notice.is_published ? "Published" : "Draft"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
