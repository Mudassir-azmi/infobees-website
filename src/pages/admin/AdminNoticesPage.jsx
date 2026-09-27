import { useCallback, useEffect, useState } from "react";
import {
  FaBullhorn,
  FaCheckCircle,
  FaEdit,
  FaExternalLinkAlt,
  FaPlus,
  FaSearch,
  FaThumbtack,
  FaTrash,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router";
import { useConfirm } from "../../components/admin/useConfirm";
import Spinner from "../../components/Spinner";
import { formatDate } from "../../lib/format";
import { deleteNotice, fetchAdminNotices, updateNotice } from "../../lib/notices";

const PAGE_SIZE = 10;
const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

function AdminNoticesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [flash, setFlash] = useState(location.state?.message ?? "");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState({ loading: true, notices: [], pagination: null, error: "" });
  const [busyId, setBusyId] = useState(null);
  const [confirm, confirmDialog] = useConfirm();

  // Clear the router state so the flash message doesn't reappear on refresh.
  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate]);

  const load = useCallback(() => {
    setData((prev) => ({ ...prev, loading: true, error: "" }));
    fetchAdminNotices({ page, limit: PAGE_SIZE, status, search })
      .then((res) => setData({ loading: false, notices: res.data, pagination: res.pagination, error: "" }))
      .catch((err) => setData({ loading: false, notices: [], pagination: null, error: err.message }));
  }, [page, status, search]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (id, action, successMessage) => {
    setBusyId(id);
    setFlash("");
    try {
      await action();
      setFlash(successMessage);
      load();
    } catch (err) {
      setData((prev) => ({ ...prev, error: err.message }));
    } finally {
      setBusyId(null);
    }
  };

  const togglePublished = (notice) =>
    runAction(
      notice.id,
      () => updateNotice(notice.id, { is_published: !notice.is_published }),
      notice.is_published ? "Notice moved to drafts." : "Notice published."
    );

  const togglePinned = (notice) =>
    runAction(
      notice.id,
      () => updateNotice(notice.id, { is_pinned: !notice.is_pinned }),
      notice.is_pinned ? "Notice unpinned." : "Notice pinned."
    );

  const remove = async (notice) => {
    const ok = await confirm({
      title: "Delete this notice?",
      message: `"${notice.title}" and all its data will be permanently deleted${
        notice.image_url ? ", including its image on Cloudinary" : ""
      }. This cannot be undone.`,
      confirmLabel: "Delete notice",
    });
    if (ok) runAction(notice.id, () => deleteNotice(notice.id), "Notice deleted.");
  };

  const { loading, notices, pagination, error } = data;

  return (
    <div className="space-y-6">
      {confirmDialog}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Content</p>
          <h1 className="mt-1 text-2xl font-bold text-navy">Notices &amp; Blogs</h1>
        </div>
        <Link
          to="/admin/notices/new"
          className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light"
        >
          <FaPlus size={12} aria-hidden="true" /> New notice
        </Link>
      </div>

      {flash && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <FaCheckCircle aria-hidden="true" /> {flash}
        </div>
      )}
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-full border border-slate-200 bg-white p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                status === tab.value ? "bg-navy text-white" : "text-text-muted hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
          className="flex gap-2"
        >
          <label htmlFor="admin-notice-search" className="sr-only">
            Search notices
          </label>
          <input
            id="admin-notice-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title or summary"
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 sm:w-64"
          />
          <button
            type="submit"
            className="rounded-full bg-navy px-4 text-white hover:bg-navy-light"
            aria-label="Search"
          >
            <FaSearch size={13} aria-hidden="true" />
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner />
        ) : notices.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FaBullhorn size={36} className="mx-auto mb-3 text-slate-300" aria-hidden="true" />
            <p className="text-sm text-text-muted">No notices found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-100 bg-bg-light text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Notice</th>
                  <th className="px-5 py-3 font-semibold">Topic</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notices.map((notice) => (
                  <tr key={notice.id} className={busyId === notice.id ? "opacity-50" : ""}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-navy">
                          {notice.image_url ? (
                            <img src={notice.image_url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <FaBullhorn className="text-gold/60" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="max-w-xs truncate font-medium text-navy">
                            {notice.is_pinned && (
                              <FaThumbtack
                                size={11}
                                className="mr-1.5 inline text-gold"
                                aria-label="Pinned"
                              />
                            )}
                            {notice.title}
                          </p>
                          {notice.link_url && (
                            <p className="max-w-xs truncate text-xs text-text-muted">{notice.link_url}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-text-muted">{notice.topic || "—"}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => togglePublished(notice)}
                        disabled={busyId === notice.id}
                        title="Click to toggle"
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                          notice.is_published
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {notice.is_published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-text-muted">
                      {formatDate(notice.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => togglePinned(notice)}
                          disabled={busyId === notice.id}
                          title={notice.is_pinned ? "Unpin" : "Pin to top"}
                          className={`rounded-lg p-2 transition-colors hover:bg-bg-light ${
                            notice.is_pinned ? "text-gold" : "text-slate-400 hover:text-navy"
                          }`}
                        >
                          <FaThumbtack size={14} />
                        </button>
                        {notice.is_published && (
                          <a
                            href={`/notices/${notice.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on website"
                            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-bg-light hover:text-navy"
                          >
                            <FaExternalLinkAlt size={13} />
                          </a>
                        )}
                        <Link
                          to={`/admin/notices/${notice.id}/edit`}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-bg-light hover:text-navy"
                        >
                          <FaEdit size={15} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(notice)}
                          disabled={busyId === notice.id}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            &larr; Previous
          </button>
          <span className="text-sm text-text-muted">
            Page {page} of {pagination.totalPages} · {pagination.total} notices
          </span>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next &rarr;
          </button>
        </nav>
      )}
    </div>
  );
}

export default AdminNoticesPage;
