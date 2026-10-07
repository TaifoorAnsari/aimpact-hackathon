import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SuccessPage from "./pages/SuccessPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminCheckinPage from "./pages/AdminCheckinPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/success/:regId" element={<SuccessPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/checkin" element={<AdminCheckinPage />} />
      </Routes>
    </BrowserRouter>
  );
}
