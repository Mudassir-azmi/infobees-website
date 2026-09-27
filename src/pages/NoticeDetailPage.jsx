import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaExternalLinkAlt, FaThumbtack } from "react-icons/fa";
import { Link, useParams } from "react-router";
import Spinner from "../components/Spinner";
import { formatDate } from "../lib/format";
import { fetchNotice } from "../lib/notices";

function NoticeDetailPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", notice: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", notice: null });
    fetchNotice(slug)
      .then((res) => {
        if (cancelled) return;
        setState({ status: "ready", notice: res.data });
        document.title = `${res.data.title} | Infobees`;
      })
      .catch((err) => {
        if (!cancelled) setState({ status: err.status === 404 ? "not-found" : "error", error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const { status, notice } = state;

  return (
    <>
      {/* Navy strip so the fixed navbar sits on a dark background. */}
      <div className="bg-gradient-navy pt-24 pb-10" />

      <section className="bg-bg-light pb-20">
        <div className="mx-auto -mt-6 max-w-3xl px-4 sm:px-6">
          <Link
            to="/notices"
            className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-navy shadow-sm transition-colors hover:text-gold-dark"
          >
            <FaArrowLeft size={12} aria-hidden="true" /> All notices
          </Link>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {status === "loading" && <Spinner />}

            {(status === "not-found" || status === "error") && (
              <div className="px-8 py-16 text-center">
                <h1 className="text-xl font-bold text-navy">
                  {status === "not-found" ? "Notice not found" : "Something went wrong"}
                </h1>
                <p className="mt-2 text-sm text-text-muted">
                  {status === "not-found"
                    ? "This notice may have been removed or unpublished."
                    : state.error}
                </p>
                <Link
                  to="/notices"
                  className="mt-6 inline-block rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-light"
                >
                  Browse all notices
                </Link>
              </div>
            )}

            {status === "ready" && (
              <article>
                {notice.image_url && (
                  <img
                    src={notice.image_url}
                    alt={notice.title}
                    className="max-h-[28rem] w-full bg-slate-100 object-contain"
                  />
                )}

                <div className="p-7 sm:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                    {notice.is_pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 font-semibold text-navy">
                        <FaThumbtack size={10} aria-hidden="true" /> Pinned
                      </span>
                    )}
                    {notice.topic && (
                      <Link
                        to={`/notices?topic=${encodeURIComponent(notice.topic)}`}
                        className="rounded-full bg-gold/10 px-2.5 py-1 font-semibold text-gold-dark hover:bg-gold/20"
                      >
                        {notice.topic}
                      </Link>
                    )}
                    <span className="inline-flex items-center gap-1 text-text-muted">
                      <FaCalendarAlt size={10} aria-hidden="true" />
                      {formatDate(notice.created_at)}
                    </span>
                  </div>

                  <h1 className="text-2xl font-bold leading-tight text-navy sm:text-3xl">
                    {notice.title}
                  </h1>

                  {notice.summary && (
                    <p className="mt-4 border-l-4 border-gold pl-4 text-base font-medium leading-relaxed text-text-dark">
                      {notice.summary}
                    </p>
                  )}

                  <div className="mt-6 whitespace-pre-line text-base leading-relaxed text-text-dark">
                    {notice.description}
                  </div>

                  {notice.link_url && (
                    <a
                      href={notice.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-gradient px-6 py-3 text-sm font-semibold text-navy shadow-sm transition-transform hover:-translate-y-0.5"
                    >
                      {notice.link_label || "Open link"}
                      <FaExternalLinkAlt size={11} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default NoticeDetailPage;
