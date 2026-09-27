import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router";
import PublicLayout from "./components/PublicLayout";
import Spinner from "./components/Spinner";
import HomePage from "./pages/HomePage";
import NoticeDetailPage from "./pages/NoticeDetailPage";
import NoticesPage from "./pages/NoticesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";

// Admin code is only downloaded when someone opens /admin.
const ProtectedAdminRoute = lazy(() => import("./components/admin/ProtectedAdminRoute"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminEnquiriesPage = lazy(() => import("./pages/admin/AdminEnquiriesPage"));
const AdminNoticesPage = lazy(() => import("./pages/admin/AdminNoticesPage"));
const AdminNoticeFormPage = lazy(() => import("./pages/admin/AdminNoticeFormPage"));
const AdminSectionPage = lazy(() => import("./pages/admin/AdminSectionPage"));
const AdminServiceEditorPage = lazy(() => import("./pages/admin/AdminServiceEditorPage"));

// Remount the editor when switching between services.
function ServiceEditorRoute() {
  const { id } = useParams();
  return <AdminServiceEditorPage key={id} />;
}

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-bg-light">
          <Spinner />
        </div>
      }
    >
      <Routes>
        {/* Public website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<Navigate to="/#services" replace />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/notices/:slug" element={<NoticeDetailPage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/enquiries" element={<AdminEnquiriesPage />} />
          <Route path="/admin/notices" element={<AdminNoticesPage />} />
          <Route path="/admin/notices/new" element={<AdminNoticeFormPage key="new" />} />
          <Route path="/admin/notices/:id/edit" element={<AdminNoticeFormPage />} />
          <Route path="/admin/sections/:key" element={<AdminSectionPage />} />
          <Route path="/admin/sections/services/:id" element={<ServiceEditorRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
