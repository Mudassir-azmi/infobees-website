import { apiRequest } from "./api";
import { optimizeImage } from "./cloudinary";
import { resolveIcon } from "./icons";
import { serviceSlug } from "./slugify";

// ---------- Public ----------

export function fetchSiteSections() {
  return apiRequest("/sections");
}

// ---------- Admin ----------

export function fetchAdminSections() {
  return apiRequest("/admin/sections");
}

export function fetchAdminSection(key) {
  return apiRequest(`/admin/sections/${key}`);
}

/** @param {FormData | object} body */
export function updateSection(key, body) {
  return apiRequest(`/admin/sections/${key}`, { method: "PATCH", body });
}

/** @param {FormData} formData */
export function createSectionItem(key, formData) {
  return apiRequest(`/admin/sections/${key}/items`, { method: "POST", body: formData });
}

/** @param {FormData | object} body */
export function updateSectionItem(id, body) {
  return apiRequest(`/admin/sections/items/${id}`, { method: "PATCH", body });
}

export function deleteSectionItem(id) {
  return apiRequest(`/admin/sections/items/${id}`, { method: "DELETE" });
}

export function reorderSectionItems(key, ids) {
  return apiRequest(`/admin/sections/${key}/items/order`, { method: "PUT", body: { ids } });
}

// ---------- Rendering helpers ----------

/** A compact service card that links to the service's own page. */
export function toServiceCard(item) {
  return {
    id: item.id,
    icon: resolveIcon(item.icon),
    image: item.image_url ? optimizeImage(item.image_url, 800) : undefined,
    title: item.title,
    description: item.description || undefined,
    to: `/services/${serviceSlug(item)}`,
  };
}
