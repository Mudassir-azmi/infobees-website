import { useEffect, useState } from "react";
import { FaBullhorn, FaCalendarAlt, FaThumbtack } from "react-icons/fa";
import { Link } from "react-router";
import SectionHeader from "../components/SectionHeader";
import { optimizeImage } from "../lib/cloudinary";
import { formatDate, noticeExcerpt } from "../lib/format";
import { fetchNotices } from "../lib/notices";

const viewAllClass =
  "rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-navy-light";

/**
 * Home-page notice board: highlights the latest (or pinned) notice and links
 * to the full list. Always rendered so the navbar's "Notices" link has a
 * target, even when there are no notices yet.
 */
function LatestNoticeSection() {
  const [state, setState] = useState({ status: "loading", notice: null });

  useEffect(() => {
    let cancelled = false;
    fetchNotices({ limit: 1 })
      .then((res) => !cancelled && setState({ status: "ready", notice: res.data[0] ?? null }))
      .catch(() => !cancelled && setState({ status: "ready", notice: null }));
    return () => {
      cancelled = true;
    };
  }, []);

  const { status, notice } = state;

  return (
    <section id="notices" className="bg-bg-light py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Notice Board"
          title="Latest Notice"
          subtitle="Announcements, admission updates and news from Infobees."
        />

        {status === "loading" && (
          <div className="mx-auto h-72 max-w-5xl animate-pulse rounded-2xl border border-slate-200 bg-white" />
        )}

        {status === "ready" && !notice && (
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <FaBullhorn size={36} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
            <p className="text-text-muted">No notices at the moment. Please check back soon.</p>
            <Link to="/notices" className={`mt-6 inline-block ${viewAllClass}`}>
              View all notices
            </Link>
          </div>
        )}

        {status === "ready" && notice && (
          <article className="mx-auto grid max-w-5xl animate-fade-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:grid-cols-[2fr_3fr]">
            <Link
              to={`/notices/${notice.slug}`}
              className="relative block h-56 overflow-hidden bg-gradient-navy md:h-full"
              aria-label={notice.title}
            >
              {notice.image_url ? (
                <img
                  src={optimizeImage(notice.image_url, 800)}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="flex h-full min-h-56 items-center justify-center">
                  <FaBullhorn size={56} className="text-gold/60" aria-hidden="true" />
                </div>
              )}
            </Link>

            <div className="flex flex-col p-7 sm:p-9">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                {notice.is_pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 font-semibold text-navy">
                    <FaThumbtack size={10} aria-hidden="true" /> Pinned
                  </span>
                )}
                {notice.topic && (
                  <span className="rounded-full bg-gold/10 px-2.5 py-1 font-semibold text-gold-dark">
                    {notice.topic}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-text-muted">
                  <FaCalendarAlt size={10} aria-hidden="true" />
                  {formatDate(notice.created_at)}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-bold leading-snug text-navy sm:text-2xl">
                <Link to={`/notices/${notice.slug}`} className="transition-colors hover:text-gold-dark">
                  {notice.title}
                </Link>
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-text-muted sm:text-base">
                {noticeExcerpt(notice, 260)}
              </p>

              <div className="mt-auto flex flex-wrap gap-3">
                <Link to="/notices" className={viewAllClass}>
                  View all notices
                </Link>
                <Link
                  to={`/notices/${notice.slug}`}
                  className="rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition-colors hover:border-gold hover:text-gold-dark"
                >
                  Read this notice
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default LatestNoticeSection;
