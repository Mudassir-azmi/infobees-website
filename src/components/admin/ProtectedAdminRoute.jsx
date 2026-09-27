import { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import { clearAdminSession, getAdminSession } from "../../lib/adminAuth";
import { apiRequest } from "../../lib/api";
import Spinner from "../Spinner";
import AdminLayout from "./AdminLayout";

/**
 * Guards admin pages: requires a stored, unexpired JWT that the backend
 * still accepts, and logs out automatically the moment it expires.
 */
function ProtectedAdminRoute() {
  const navigate = useNavigate();
  const [session] = useState(getAdminSession);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;
    const expire = (message) => {
      if (cancelled) return;
      clearAdminSession();
      navigate("/admin", { replace: true, state: { message } });
    };

    apiRequest("/admin/me")
      .then((res) => !cancelled && setAdmin(res.data))
      .catch(() => expire("Please log in again."));

    const timer = setTimeout(
      () => expire("Your session expired. Please log in again."),
      session.expiresAt - Date.now()
    );

    // Any admin API call that gets a 401 triggers this (see lib/api.js).
    const onExpired = () => expire("Your session expired. Please log in again.");
    window.addEventListener("admin-session-expired", onExpired);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      window.removeEventListener("admin-session-expired", onExpired);
    };
  }, [session, navigate]);

  if (!session) return <Navigate to="/admin" replace />;

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-light">
        <Spinner />
      </div>
    );
  }

  return (
    <AdminLayout admin={admin}>
      <Outlet context={{ admin, expiresAt: session.expiresAt }} />
    </AdminLayout>
  );
}

export default ProtectedAdminRoute;
