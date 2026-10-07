import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { TbLock, TbMail, TbArrowLeft, TbSparkles } from "react-icons/tb";
import "../styles/admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for httpOnly cookie
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Invalid organizer credentials.");
      }

      // Save token in localStorage as well for authorization header fallback
      if (data.token) {
        localStorage.setItem("aimpact_admin_token", data.token);
      }
      localStorage.setItem("aimpact_admin_user", JSON.stringify(data.admin));

      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout" style={{ justifyContent: "center", alignItems: "center" }}>
      <div className="reg-bg-glow" aria-hidden="true" />

      <div style={{ maxWidth: "420px", width: "100%", padding: "20px" }}>
        <div className="form-card" style={{ padding: "36px 28px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <span className="section-pill" style={{ margin: "0 auto 12px" }}>
              <TbSparkles aria-hidden="true" /> ORGANIZER PORTAL
            </span>
            <h1 className="admin-stat-num" style={{ fontSize: "24px" }}>
              AIMPACT Admin
            </h1>
            <p style={{ color: "var(--rose)", fontSize: "13px", margin: "4px 0 0" }}>
              Sign in to manage registrations, teams, and check-ins.
            </p>
          </div>

          {error && (
            <div className="server-error-banner" role="alert" style={{ marginBottom: "18px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">
                Organizer Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-email"
                  type="email"
                  className="form-input"
                  placeholder="admin@aimpact.apsit.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="admin-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn--solid"
              style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Sign In to Dashboard"}
            </button>
          </form>

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link to="/" style={{ color: "var(--teal)", fontSize: "12px", textDecoration: "underline" }}>
              &larr; Back to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
