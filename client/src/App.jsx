import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";

const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const SuccessPage = lazy(() => import("./pages/SuccessPage.jsx"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage.jsx"));
const AdminCheckinPage = lazy(() => import("./pages/AdminCheckinPage.jsx"));

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "var(--bg)",
        color: "var(--teal)",
        fontFamily: "var(--font-display)",
        fontSize: "14px",
        letterSpacing: "2px",
      }}
    >
      LOADING...
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/success/:regId" element={<SuccessPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/checkin" element={<AdminCheckinPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
