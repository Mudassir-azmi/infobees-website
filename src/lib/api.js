import { clearAdminSession, getAdminToken } from "./adminAuth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Small fetch wrapper. Attaches the admin JWT when present and throws an
 * Error (with `.status`) for non-2xx responses.
 */
export async function apiRequest(path, { method = "GET", body, headers = {} } = {}) {
  const token = getAdminToken();
  const isFormData = body instanceof FormData;

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(!isFormData && body !== undefined && { "Content-Type": "application/json" }),
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      },
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAdminSession();
      window.dispatchEvent(new Event("admin-session-expired"));
    }
    const error = new Error(data.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return data;
}
