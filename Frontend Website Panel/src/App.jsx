import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Shared Utilities
import ErrorBoundary from "./components/shared/ErrorBoundary";
import ScrollToTop from "./components/shared/ScrollToTop";
import NetworkStatusBanner from "./components/shared/NetworkStatusBanner";

// Layouts (per role)
import AdminLayout from "./layouts/AdminLayout";
import ResellerLayout from "./layouts/ResellerLayout";
import ViewerLayout from "./layouts/ViewerLayout";

// Splash & Special Pages
import SplashScreen from "./pages/SplashScreen";
import NotFound from "./pages/NotFound";

// Role-Specific Dashboards
import Dashboard from "./pages/admin/Dashboard";
import ContentAdminDashboard from "./pages/content_admin/ContentAdminDashboard";
import MarketingDashboard from "./pages/marketing/MarketingDashboard";
import ResellerDashboard from "./pages/reseller/ResellerDashboard";
import ViewerDashboard from "./pages/viewer/ViewerDashboard";

// Admin & Feature Pages
import Berita from "./pages/admin/Berita";
import NewsReport from "./pages/admin/NewsReport";
import Popup from "./pages/admin/Popup";
import Slider from "./pages/admin/Slider";
import Pengumuman from "./pages/admin/Pengumuman";
import RewardsPage from "./pages/admin/RewardsPage";
import AdminPage from "./pages/admin/AdminUserPage";
import MPointPage from "./pages/admin/MPointPage";
import TambahAdminUser from "./pages/admin/TambahAdminUser";
import Promotion from "./pages/admin/Promotion";
import RunningsPage from "./pages/admin/RunningsPage";
import Tips from "./pages/admin/Tips";
import IntroPage from "./pages/admin/IntroPage";
import AdminKuesioner from "./pages/admin/AdminKuesioner";
import InteraksiPage from "./pages/admin/InteraksiPage";
import AuditLogs from "./pages/admin/AuditLogs";
import SystemHealthPage from "./pages/admin/SystemHealthPage";
import CommandPalette from "./components/shared/CommandPalette";
import BackToTop from "./components/shared/BackToTop";

// Viewer Pages
import BeritaViewer from "./pages/viewer/BeritaViewer";
import SliderViewer from "./pages/viewer/SliderViewer";
import PopupViewer from "./pages/viewer/PopupViewer";
import PengumumanViewer from "./pages/viewer/PengumumanViewer";
import RewardsViewer from "./pages/viewer/RewardsViewer";
import PromotionViewer from "./pages/viewer/PromotionViewer";
import MPointViewer from "./pages/viewer/MPointViewer";
import RunningsViewer from "./pages/viewer/RunningsViewer";
import TipsViewer from "./pages/viewer/TipsViewer";
import ViewerKuesioner from "./pages/viewer/ViewerKuesioner";
import InteraksiViewer from "./pages/viewer/InteraksiViewer";
import NewsReportViewer from "./pages/viewer/NewsReportViewer";
import IntroViewer from "./pages/viewer/IntroViewer";

// Auth Pages
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Logout from "./Auth/Logout";
import RedirectAfterLogin from "./Auth/RedirectAfterLogin";
import { getAuthToken, getAuthRole } from "./utils/authHelper";

// 1. Private Route Checker
function PrivateRoute({ children, allowedRoles }) {
  const token = getAuthToken();
  const role = getAuthRole() || "viewer";

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-2xl text-center space-y-4 animate-scale-up">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-2xl">
            🚫
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Akses Dibatasi
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Akun Anda dengan role <strong>"{role}"</strong> tidak memiliki izin untuk membuka halaman ini.
          </p>
          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition"
            >
              Kembali ke Halaman Sebelumnya
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

// 2. Dynamic Smart Layout based on logged-in role
function RoleAwareLayout({ children }) {
  const role = getAuthRole() || "viewer";

  if (role === "reseller") {
    return <ResellerLayout>{children}</ResellerLayout>;
  }

  if (role === "viewer") {
    return <ViewerLayout>{children}</ViewerLayout>;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

// Role Helper Constants
const ALL_ROLES = ["super_admin", "content_admin", "marketing", "reseller", "viewer"];
const ADMIN_ROLES = ["super_admin", "content_admin", "marketing"];

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <NetworkStatusBanner />
        <CommandPalette />
        <BackToTop />
        <Routes>
        {/* Splash Screen (root route) */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/redirect" element={<RedirectAfterLogin />} />

        {/* 1. Super Admin Dashboard */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* 2. Content Admin Dashboard */}
        <Route
          path="/content-admin/dashboard"
          element={
            <PrivateRoute allowedRoles={["content_admin", "super_admin"]}>
              <AdminLayout>
                <ContentAdminDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* 3. Marketing Dashboard */}
        <Route
          path="/marketing/dashboard"
          element={
            <PrivateRoute allowedRoles={["marketing", "super_admin"]}>
              <AdminLayout>
                <MarketingDashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* 4. Reseller Partner Portal (E-Commerce Style Experience) */}
        <Route
          path="/reseller/dashboard"
          element={
            <PrivateRoute allowedRoles={["reseller", "super_admin"]}>
              <ResellerLayout>
                <ResellerDashboard />
              </ResellerLayout>
            </PrivateRoute>
          }
        />

        {/* 5. Viewer News & Media Portal (Public Magazine Style) */}
        <Route
          path="/viewer/dashboard"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <ViewerDashboard />
              </ViewerLayout>
            </PrivateRoute>
          }
        />

        {/* Multi-Role Feature Modules */}
        <Route
          path="/admin/Berita"
          element={
            <PrivateRoute allowedRoles={ADMIN_ROLES}>
              <AdminLayout>
                <Berita />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/slider"
          element={
            <PrivateRoute allowedRoles={ADMIN_ROLES}>
              <AdminLayout>
                <Slider />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/popup"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin"]}>
              <AdminLayout>
                <Popup />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pengumuman"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin"]}>
              <AdminLayout>
                <Pengumuman />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/rewards"
          element={
            <PrivateRoute allowedRoles={ALL_ROLES}>
              <RoleAwareLayout>
                <RewardsPage />
              </RoleAwareLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/promotion"
          element={
            <PrivateRoute allowedRoles={ALL_ROLES}>
              <RoleAwareLayout>
                <Promotion />
              </RoleAwareLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/mpoint"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin", "reseller", "viewer"]}>
              <RoleAwareLayout>
                <MPointPage />
              </RoleAwareLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/runnings"
          element={
            <PrivateRoute allowedRoles={["super_admin", "marketing"]}>
              <AdminLayout>
                <RunningsPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tips"
          element={
            <PrivateRoute allowedRoles={ALL_ROLES}>
              <RoleAwareLayout>
                <Tips />
              </RoleAwareLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/kuesioner"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin"]}>
              <AdminLayout>
                <AdminKuesioner />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/kuesioner"
          element={<Navigate to="/admin/kuesioner" replace />}
        />
        <Route
          path="/InteraksiPage"
          element={
            <PrivateRoute allowedRoles={["super_admin", "marketing", "reseller", "viewer"]}>
              <RoleAwareLayout>
                <InteraksiPage />
              </RoleAwareLayout>
            </PrivateRoute>
          }
        />

        {/* Super Admin User Management */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <AdminPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/user"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <AdminPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin-user/tambah"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <TambahAdminUser />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tambah-user"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <TambahAdminUser />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <AuditLogs />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/system-health"
          element={
            <PrivateRoute allowedRoles={["super_admin"]}>
              <AdminLayout>
                <SystemHealthPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/newsreport"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin", "viewer"]}>
              <AdminLayout>
                <NewsReport />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/intro"
          element={
            <PrivateRoute allowedRoles={["super_admin", "content_admin"]}>
              <AdminLayout>
                <IntroPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Viewer Read-Only Pages */}
        <Route
          path="/viewer/berita"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <BeritaViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/slider"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <SliderViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/popup"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <PopupViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/pengumuman"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <PengumumanViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/rewards"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <RewardsViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/promotion"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <PromotionViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/mpoint"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <MPointViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/runnings"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <RunningsViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/tips"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <TipsViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/kuesioner"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <ViewerKuesioner />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/interaksi"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <InteraksiViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/newsreport"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <NewsReportViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/viewer/intro"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <IntroViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />

        {/* Viewer: Popup & Intro (additional media pages) */}
        <Route
          path="/viewer/popup"
          element={
            <PrivateRoute allowedRoles={["viewer", "super_admin"]}>
              <ViewerLayout>
                <PopupViewer />
              </ViewerLayout>
            </PrivateRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);
}
