// Same rules as the backend (Backend/src/utils/slugify.js).
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** URL slug of a service item (older rows may not have one saved yet). */
export function serviceSlug(item) {
  return item.slug || slugify(item.title);
}
