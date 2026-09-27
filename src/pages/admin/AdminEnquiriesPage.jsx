import { useCallback, useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaEnvelope,
  FaExclamationTriangle,
  FaInbox,
  FaPhoneAlt,
  FaSearch,
  FaTrash,
  FaWhatsapp,
} from "react-icons/fa";
import { useConfirm } from "../../components/admin/useConfirm";
import Spinner from "../../components/Spinner";
import { whatsappDigits } from "../../lib/contact";
import {
  deleteEnquiry,
  ENQUIRY_STATUSES,
  fetchEnquiries,
  fetchEnquiryStats,
  notifyEnquiriesChanged,
  updateEnquiryStatus,
} from "../../lib/enquiries";

const PAGE_SIZE = 20;

const STATUS_STYLES = {
  new: "bg-gold/15 text-gold-dark",
  in_progress: "bg-blue-50 text-blue-700",
  resolved: "bg-green-50 text-green-700",
};

const statusLabel = (value) => ENQUIRY_STATUSES.find((s) => s.value === value)?.label ?? value;

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EnquiryCard({ enquiry, busy, onStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const subject = encodeURIComponent(
    `Re: your enquiry${enquiry.service ? ` about ${enquiry.service}` : ""} — Infobees`
  );
  const greeting = encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting Infobees.`);

  return (
    <article
      className={`rounded-2xl border bg-white shadow-sm transition-opacity ${
        enquiry.status === "new" ? "border-gold/40" : "border-slate-200"
      } ${busy ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-base font-bold text-gold">
          {enquiry.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-navy">{enquiry.name}</p>
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[enquiry.status]}`}>
              {statusLabel(enquiry.status)}
            </span>
            {enquiry.service && (
              <span className="rounded-full bg-bg-light px-2 py-0.5 text-[11px] font-medium text-text-muted">
                {enquiry.service}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-text-muted">{formatDateTime(enquiry.created_at)}</p>
          <p
            className={`mt-2 text-sm leading-relaxed text-text-dark ${
              open ? "whitespace-pre-line" : "line-clamp-2"
            }`}
          >
            {enquiry.message}
          </p>
        </div>
        <FaChevronDown
          className={`mt-1 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="space-y-4 border-t border-slate-100 px-5 py-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-text-muted">Email</dt>
              <dd>
                <a href={`mailto:${enquiry.email}`} className="break-all text-navy hover:text-gold-dark">
                  {enquiry.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-text-muted">Phone / WhatsApp</dt>
              <dd>
                <a href={`tel:+${whatsappDigits(enquiry.phone)}`} className="text-navy hover:text-gold-dark">
                  {enquiry.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${enquiry.email}?subject=${subject}&body=${greeting}`}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-light"
            >
              <FaEnvelope aria-hidden="true" /> Reply by email
            </a>
            <a
              href={`https://wa.me/${whatsappDigits(enquiry.phone)}?text=${greeting}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              <FaWhatsapp aria-hidden="true" /> WhatsApp
            </a>
            <a
              href={`tel:+${whatsappDigits(enquiry.phone)}`}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-navy hover:border-gold"
            >
              <FaPhoneAlt aria-hidden="true" /> Call
            </a>

            <div className="ml-auto flex items-center gap-2">
              <label htmlFor={`status-${enquiry.id}`} className="sr-only">
                Status
              </label>
              <select
                id={`status-${enquiry.id}`}
                value={enquiry.status}
                disabled={busy}
                onChange={(e) => onStatus(e.target.value)}
                className="rounded-full border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-navy focus:border-gold focus:outline-none"
              >
                {ENQUIRY_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={onDelete}
                disabled={busy}
                title="Delete enquiry"
                aria-label="Delete enquiry"
                className="rounded-full p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function AdminEnquiriesPage() {
  const [status, setStatus] = useState("new");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [stats, setStats] = useState(null);
  const [data, setData] = useState({ loading: true, items: [], pagination: null, error: "" });
  const [busyId, setBusyId] = useState(null);
  const [flash, setFlash] = useState("");
  const [confirm, confirmDialog] = useConfirm();

  const load = useCallback(() => {
    setData((prev) => ({ ...prev, loading: true, error: "" }));
    fetchEnquiries({ status, page, limit: PAGE_SIZE, search })
      .then((res) => setData({ loading: false, items: res.data, pagination: res.pagination, error: "" }))
      .catch((err) => setData({ loading: false, items: [], pagination: null, error: err.message }));
    fetchEnquiryStats()
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, [status, page, search]);

  useEffect(() => {
    load();
  }, [load]);

  const showFlash = (message) => {
    setFlash(message);
    setTimeout(() => setFlash((current) => (current === message ? "" : current)), 3000);
  };

  const changeStatus = async (enquiry, next) => {
    setBusyId(enquiry.id);
    try {
      await updateEnquiryStatus(enquiry.id, next);
      showFlash(`Marked as ${statusLabel(next).toLowerCase()}.`);
      notifyEnquiriesChanged();
      load();
    } catch (err) {
      setData((prev) => ({ ...prev, error: err.message }));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (enquiry) => {
    const ok = await confirm({
      title: "Delete this enquiry?",
      message: `The enquiry from ${enquiry.name} will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    setBusyId(enquiry.id);
    try {
      await deleteEnquiry(enquiry.id);
      showFlash("Enquiry deleted.");
      notifyEnquiriesChanged();
      load();
    } catch (err) {
      setData((prev) => ({ ...prev, error: err.message }));
    } finally {
      setBusyId(null);
    }
  };

  const tabs = [
    ...ENQUIRY_STATUSES.map((s) => ({ ...s, count: stats?.[s.value] })),
    { value: "", label: "All", count: stats?.total },
  ];
  const { loading, items, pagination, error } = data;

  return (
    <div className="space-y-6">
      {confirmDialog}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Contact form</p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Enquiries</h1>
        <p className="text-sm text-text-muted">
          Messages sent through the website&apos;s contact form. Click one to read it and reply.
        </p>
      </div>

      {flash && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-800">
          <FaCheckCircle aria-hidden="true" /> {flash}
        </div>
      )}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-1 rounded-full border border-slate-200 bg-white p-1">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                status === tab.value ? "bg-navy text-white" : "text-text-muted hover:text-navy"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-1.5 text-[11px] ${
                    status === tab.value ? "bg-white/20" : "bg-bg-light"
                  }`}
                >
                  {tab.count}
                </span>
              )}
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
          <label htmlFor="enquiry-search" className="sr-only">
            Search enquiries
          </label>
          <input
            id="enquiry-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search name, email, phone, service"
            className="w-full rounded-full border border-slate-300 bg-white px-4 py-2 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 lg:w-72"
          />
          <button type="submit" aria-label="Search" className="rounded-full bg-navy px-4 text-white hover:bg-navy-light">
            <FaSearch size={13} aria-hidden="true" />
          </button>
        </form>
      </div>

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <FaInbox size={36} className="mx-auto mb-3 text-slate-300" aria-hidden="true" />
          <p className="text-sm text-text-muted">
            {search
              ? "No enquiries match your search."
              : status
                ? `No ${statusLabel(status).toLowerCase()} enquiries.`
                : "No enquiries yet. They appear here when visitors use the contact form."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((enquiry) => (
            <EnquiryCard
              key={enquiry.id}
              enquiry={enquiry}
              busy={busyId === enquiry.id}
              onStatus={(next) => changeStatus(enquiry, next)}
              onDelete={() => remove(enquiry)}
            />
          ))}
        </div>
      )}

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
            Page {page} of {pagination.totalPages}
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

export default AdminEnquiriesPage;
