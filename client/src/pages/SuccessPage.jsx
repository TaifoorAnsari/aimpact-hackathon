import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { EVENT } from "../config/event.js";
import {
  TbCheck,
  TbBrandWhatsapp,
  TbArrowLeft,
  TbMailCheck,
  TbBuildingCommunity,
} from "react-icons/tb";
import "../styles/success.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function SuccessPage() {
  const { regId } = useParams();
  const location = useLocation();

  const [regData, setRegData] = useState(location.state || null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!regData && regId) {
      fetch(`${API_BASE}/api/registrations/${regId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not find registration details.");
          return res.json();
        })
        .then((data) => setRegData(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [regId, regData]);


  if (loading) {
    return (
      <div className="success-page">
        <div className="success-card" style={{ marginTop: "60px", color: "var(--ice)" }}>
          <p>Retrieving registration pass...</p>
        </div>
      </div>
    );
  }

  if (error || !regData) {
    return (
      <div className="success-page">
        <div className="success-card" style={{ marginTop: "60px" }}>
          <h2 style={{ color: "#ff6b6b" }}>Registration Not Found</h2>
          <p style={{ color: "var(--rose)", margin: "16px 0 24px" }}>
            {error || "We couldn't locate this registration ID."}
          </p>
          <Link to="/" className="btn btn--solid">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-card">
          {/* Animated checkmark */}
          <div className="checkmark-wrap" aria-hidden="true">
            <TbCheck className="checkmark-icon" />
          </div>

          <h1 className="success-title">Registration Confirmed!</h1>
          <p className="success-subtitle">
            Welcome to AIMPACT 2026, <strong>{regData.teamName}</strong>. Your team is officially confirmed for the 24-hour sprint.
          </p>

          {/* Registration ID Banner */}
          <div className="reg-id-box">
            <span className="reg-id-label">Official Registration Pass</span>
            <span className="reg-id-value">{regId}</span>
            <p style={{ fontSize: "12px", color: "var(--rose)", margin: "8px 0 0" }}>
              Save or screenshot this Registration ID. Present it at the desk on Oct 17 for quick campus check-in.
            </p>
          </div>

          {/* Summary Box */}
          <div className="summary-box">
            <div className="summary-row">
              <span>Team Name:</span>
              <span>{regData.teamName}</span>
            </div>
            <div className="summary-row">
              <span>Track:</span>
              <span>{(regData.track || "").toUpperCase()}</span>
            </div>
            <div className="summary-row">
              <span>Date & Time:</span>
              <span>{EVENT.dateLabel} (08:00 AM)</span>
            </div>
            <div className="summary-row">
              <span>Venue:</span>
              <span>{EVENT.venueLabel}</span>
            </div>
            <div className="summary-row">
              <span>Status:</span>
              <span style={{ color: "#6fc7d1", textTransform: "capitalize" }}>
                {regData.status || "Confirmed"}
              </span>
            </div>
          </div>

          {/* Email notice */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "var(--teal-soft)",
              fontSize: "13px",
              marginBottom: "28px",
            }}
          >
            <TbMailCheck style={{ fontSize: "18px" }} />
            <span>Confirmation details and roster have been emailed to your squad.</span>
          </div>

          {/* Action buttons */}
          <div className="success-actions">
            <a
              href={EVENT.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--whatsapp"
            >
              <TbBrandWhatsapp style={{ fontSize: "20px" }} /> Join WhatsApp Group
            </a>

          </div>

          <div style={{ marginTop: "24px" }}>
            <Link to="/" className="btn btn--ghost" style={{ fontSize: "12px", padding: "8px 16px" }}>
              <TbArrowLeft /> Back to Hackathon Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
