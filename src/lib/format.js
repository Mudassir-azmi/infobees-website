export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Summary if present, otherwise the start of the description. */
export function noticeExcerpt(notice, maxLength = 180) {
  const text = notice.summary || notice.description || "";
  return text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;
}
