import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbCheck,
  TbAlertCircle,
  TbX,
  TbRefresh,
  TbUserCheck,
} from "react-icons/tb";
import "../styles/admin.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminCheckinPage() {
  const navigate = useNavigate();

  const [manualId, setManualId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success' | 'warning' | 'error', message, reg }

  const getAuthHeader = () => {
    const token = localStorage.getItem("aimpact_admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const processCheckIn = async (regIdToProcess) => {
    if (!regIdToProcess || loading) return;
    const cleanId = regIdToProcess.trim();
    if (!cleanId) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/registrations/${encodeURIComponent(cleanId)}/check-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        credentials: "include",
      });

      if (res.status === 401) {
        navigate("/admin/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setResult({
          type: "error",
          message: data.error?.message || `No registration found for "${cleanId}".`,
          reg: null,
        });
      } else if (data.alreadyCheckedIn) {
        setResult({
          type: "warning",
          message: data.message,
          reg: data.registration,
        });
      } else {
        setResult({
          type: "success",
          message: `Team "${data.registration.teamName}" successfully checked in!`,
          reg: data.registration,
        });
      }
    } catch (err) {
      setResult({
        type: "error",
        message: "Failed to connect to check-in server: " + err.message,
        reg: null,
      });
    } finally {
      setLoading(false);
      setManualId("");
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    processCheckIn(manualId);
  };

  const resetResult = () => {
    setResult(null);
  };

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header__brand">
          <Link to="/admin" className="reg-back-link" style={{ fontSize: "12px", padding: "6px 12px" }}>
            <TbArrowLeft /> Back to Dashboard
          </Link>
          <span className="admin-badge">EVENT DAY CHECK-IN</span>
        </div>

        <span style={{ fontSize: "12px", color: "var(--teal-soft)" }}>
          A.P. Shah Institute of Technology
        </span>
      </header>

      <main className="admin-main" style={{ display: "flex", justifyContent: "center" }}>
        <div className="scanner-card">
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(111, 199, 209, 0.15)", color: "var(--teal-soft)", marginBottom: "16px", fontSize: "24px" }}>
            <TbUserCheck />
          </div>

          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "#fff", margin: "0 0 8px" }}>
            Event Day Desk Check-In
          </h1>
          <p style={{ color: "var(--rose)", fontSize: "13px", margin: "0 0 28px" }}>
            Enter the team Registration ID to verify identity, view squad roster, and issue hackathon badges.
          </p>

          {/* Registration ID Input */}
          <form onSubmit={handleManualSubmit} style={{ maxWidth: "420px", margin: "0 auto 28px" }}>
            <label className="form-label" htmlFor="manual-reg-id" style={{ textAlign: "left" }}>
              Enter Registration ID:
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                id="manual-reg-id"
                type="text"
                className="form-input"
                placeholder="e.g. AIM-2026-0001"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                autoFocus
              />
              <button type="submit" className="btn btn--solid" disabled={loading || !manualId.trim()}>
                {loading ? "Checking..." : "Verify"}
              </button>
            </div>
          </form>

          {/* Result Banner (Big Green or Red or Warning) */}
          {result && (
            <div className={`scan-result-banner scan-result--${result.type}`} role="status">
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>
                {result.type === "success" && <TbCheck />}
                {result.type === "warning" && <TbAlertCircle />}
                {result.type === "error" && <TbX />}
              </div>

              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", margin: "0 0 8px" }}>
                {result.type === "success" && "CHECK-IN VERIFIED!"}
                {result.type === "warning" && "ALREADY CHECKED IN"}
                {result.type === "error" && "CHECK-IN REJECTED"}
              </h2>

              <p style={{ fontSize: "14px", margin: "0 0 16px" }}>{result.message}</p>

              {result.reg && (
                <div
                  style={{
                    textAlign: "left",
                    background: "rgba(0, 0, 0, 0.35)",
                    padding: "16px",
                    borderRadius: "6px",
                    marginBottom: "16px",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <strong>Team:</strong> {result.reg.teamName} ({result.reg.regId})
                  </div>
                  <div>
                    <strong>Track:</strong> {(result.reg.track || "").toUpperCase()}
                  </div>
                  <div>
                    <strong>Leader:</strong> {result.reg.members?.[0]?.name} ({result.reg.members?.[0]?.phone})
                  </div>
                  <div>
                    <strong>College:</strong> {result.reg.members?.[0]?.college}
                  </div>
                  <div style={{ marginTop: "8px", color: "var(--ice)" }}>
                    <strong>Roster ({result.reg.members?.length} Members):</strong>{" "}
                    {result.reg.members?.map((m) => m.name).join(", ")}
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn btn--ghost"
                onClick={resetResult}
                style={{ background: "#ffffff", color: "#000", fontWeight: "700" }}
              >
                <TbRefresh /> Check-In Next Team
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
