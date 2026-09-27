const STORAGE_KEY = "infobees_admin_session";

/** @returns {{ token: string, expiresAt: number, admin: object } | null} */
export function getAdminSession() {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!session?.token || !session?.expiresAt) return null;
    if (Date.now() >= session.expiresAt) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveAdminSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAdminToken() {
  return getAdminSession()?.token ?? null;
}
