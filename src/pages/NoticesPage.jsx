import { useEffect, useState } from "react";
import { FaBullhorn, FaSearch } from "react-icons/fa";
import { useSearchParams } from "react-router";
import NoticeCard from "../components/notices/NoticeCard";
import Spinner from "../components/Spinner";
import { fetchNotices, fetchNoticeTopics } from "../lib/notices";

const PAGE_SIZE = 9;

function NoticesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);
  const topic = searchParams.get("topic") || "";
  const search = searchParams.get("search") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [topics, setTopics] = useState([]);
  const [result, setResult] = useState({ status: "loading", notices: [], pagination: null });

  useEffect(() => {
    document.title = "Notices | Infobees";
    fetchNoticeTopics()
      .then((res) => setTopics(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setResult((prev) => ({ ...prev, status: "loading" }));
    fetchNotices({ page, limit: PAGE_SIZE, topic, search })
      .then((res) => {
        if (!cancelled) setResult({ status: "ready", notices: res.data, pagination: res.pagination });
      })
      .catch((err) => {
        if (!cancelled) setResult({ status: "error", notices: [], pagination: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [page, topic, search]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next);
  };

  const onSearch = (event) => {
    event.preventDefault();
    updateParams({ search: searchInput.trim(), page: "" });
  };

  const { status, notices, pagination } = result;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy pt-32 pb-16 sm:pt-36">
        <div className="pointer-events-none absolute inset-0 line-grid opacity-[0.05]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <FaBullhorn aria-hidden="true" /> Notice Board
          </span>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">All Notices &amp; Updates</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Stay up to date with announcements, admissions, services and news from Infobees.
          </p>

          <form onSubmit={onSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
            <label htmlFor="notice-search" className="sr-only">
              Search notices
            </label>
            <input
              id="notice-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search notices..."
              className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-slate-400 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy transition-colors hover:bg-gold-light"
            >
              <FaSearch aria-hidden="true" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>
      </section>

      <section className="bg-bg-light py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {topics.length > 0 && (
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              {["", ...topics].map((item) => (
                <button
                  key={item || "all"}
                  type="button"
                  onClick={() => updateParams({ topic: item, page: "" })}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    topic === item
                      ? "border-navy bg-navy text-white"
                      : "border-slate-300 bg-white text-text-dark hover:border-gold hover:text-gold-dark"
                  }`}
                >
                  {item || "All"}
                </button>
              ))}
            </div>
          )}

          {status === "loading" && <Spinner />}

          {status === "error" && (
            <p className="py-16 text-center text-sm text-red-700">
              Couldn&apos;t load notices: {result.error}
            </p>
          )}

          {status === "ready" && notices.length === 0 && (
            <div className="py-16 text-center">
              <FaBullhorn size={40} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
              <p className="text-text-muted">
                {search || topic ? "No notices match your filters." : "No notices have been published yet."}
              </p>
            </div>
          )}

          {status === "ready" && notices.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {notices.map((notice) => (
                  <NoticeCard key={notice.id} notice={notice} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <nav className="mt-12 flex items-center justify-center gap-3" aria-label="Pagination">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => updateParams({ page: String(page - 1) })}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-navy transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    &larr; Previous
                  </button>
                  <span className="text-sm text-text-muted">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= pagination.totalPages}
                    onClick={() => updateParams({ page: String(page + 1) })}
                    className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-navy transition-colors hover:border-gold disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next &rarr;
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

export default NoticesPage;
