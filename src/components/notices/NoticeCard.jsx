import { FaBullhorn, FaCalendarAlt, FaThumbtack } from "react-icons/fa";
import { Link } from "react-router";
import { formatDate, noticeExcerpt } from "../../lib/format";

function NoticeCard({ notice }) {
  return (
    <Link
      to={`/notices/${notice.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl"
    >
      <div className="relative h-44 w-full overflow-hidden bg-gradient-navy">
        {notice.image_url ? (
          <img
            src={notice.image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaBullhorn size={40} className="text-gold/60" aria-hidden="true" />
          </div>
        )}
        {notice.is_pinned && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-navy shadow">
            <FaThumbtack size={10} aria-hidden="true" /> Pinned
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
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

        <h3 className="mb-2 text-lg font-semibold leading-snug text-navy transition-colors group-hover:text-gold-dark">
          {notice.title}
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-text-muted">
          {noticeExcerpt(notice)}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-navy transition-colors group-hover:text-gold">
          Read notice
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            &rarr;
          </span>
        </span>
      </div>
    </Link>
  );
}

export default NoticeCard;
