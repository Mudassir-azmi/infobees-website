import { apiRequest } from "./api";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

// ---------- Public (website) ----------

export function fetchNotices(params) {
  return apiRequest(`/notices${toQuery(params)}`);
}

export function fetchNoticeTopics() {
  return apiRequest("/notices/topics");
}

export function fetchNotice(slug) {
  return apiRequest(`/notices/${encodeURIComponent(slug)}`);
}

// ---------- Admin ----------

export function fetchAdminNotices(params) {
  return apiRequest(`/admin/notices${toQuery(params)}`);
}

export function fetchAdminNoticeStats() {
  return apiRequest("/admin/notices/stats");
}

export function fetchAdminNotice(id) {
  return apiRequest(`/admin/notices/${id}`);
}

/** @param {FormData} formData */
export function createNotice(formData) {
  return apiRequest("/admin/notices", { method: "POST", body: formData });
}

/** @param {FormData | object} body */
export function updateNotice(id, body) {
  return apiRequest(`/admin/notices/${id}`, { method: "PATCH", body });
}

export function deleteNotice(id) {
  return apiRequest(`/admin/notices/${id}`, { method: "DELETE" });
}
