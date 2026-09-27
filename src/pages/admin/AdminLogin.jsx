import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationTriangle, FaInfoCircle, FaLock } from "react-icons/fa";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import beeLogo from "../../assets/images/logo/bee.svg";
import { getAdminSession, saveAdminSession } from "../../lib/adminAuth";
import { apiRequest } from "../../lib/api";
import { useSeo } from "../../lib/seo";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-text-dark placeholder:text-slate-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

function AdminLogin() {
  const navigate = useNavigate();
  useSeo({ title: "Admin Login", path: "/admin", noindex: true });
  const location = useLocation();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  // Already logged in? Go straight to the dashboard.
  if (getAdminSession()) return <Navigate to="/admin/dashboard" replace />;

  const onSubmit = async ({ email, password }) => {
    setServerError("");
    try {
      const res = await apiRequest("/admin/login", {
        method: "POST",
        body: { email, password },
      });
      saveAdminSession(res.data);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message);
    }
  };

  const notice = location.state?.message;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-navy px-4 py-12">
      <div className="pointer-events-none absolute inset-0 line-grid opacity-[0.05]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gold/10 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={beeLogo} alt="" aria-hidden="true" className="h-14 w-14" />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Info<span className="text-gold">bees</span> Admin
          </h1>
          <p className="mt-2 text-sm text-slate-300">Sign in to manage your website</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          {notice && (
            <div className="mb-5 flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <FaInfoCircle className="mt-0.5 shrink-0" aria-hidden="true" />
              <p>{notice}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className={inputClass}
                aria-invalid={errors.email ? "true" : "false"}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className={inputClass}
                aria-invalid={errors.password ? "true" : "false"}
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <FaExclamationTriangle className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaLock size={13} aria-hidden="true" />
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          <Link to="/" className="transition-colors hover:text-gold">
            &larr; Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
