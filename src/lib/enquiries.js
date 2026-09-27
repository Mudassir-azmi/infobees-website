import { apiRequest } from "./api";

// ---------- Public (contact form) ----------

/** @param {{ name, email, phone, service, message, website }} enquiry */
export function submitEnquiry(enquiry) {
  return apiRequest("/enquiries", { method: "POST", body: enquiry });
}

// ---------- Admin ----------

export const ENQUIRY_STATUSES = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

export function fetchEnquiries(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return apiRequest(`/admin/enquiries${query ? `?${query}` : ""}`);
}

export function fetchEnquiryStats() {
  return apiRequest("/admin/enquiries/stats");
}

export function updateEnquiryStatus(id, status) {
  return apiRequest(`/admin/enquiries/${id}`, { method: "PATCH", body: { status } });
}

export function deleteEnquiry(id) {
  return apiRequest(`/admin/enquiries/${id}`, { method: "DELETE" });
}

/** Tells the admin sidebar to refresh its "new enquiries" badge. */
export function notifyEnquiriesChanged() {
  window.dispatchEvent(new Event("enquiries-changed"));
}
