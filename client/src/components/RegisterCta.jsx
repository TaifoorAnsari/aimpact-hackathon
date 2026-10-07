import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EVENT } from "../config/event.js";
import { TbFlame, TbArrowRight, TbUsers, TbClock, TbAlertCircle } from "react-icons/tb";
import "../styles/register-cta.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function RegisterCta() {
  const [stats, setStats] = useState({
    spotsLeft: 150,
    capacity: 150,
    open: true,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch(`${API_BASE}/api/stats`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data) {
          setStats(data);
        }
      })
      .catch(() => {
        // Graceful fallback to default stats
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const isClosed = !stats.open || stats.spotsLeft <= 0;

  return (
    <section className="register-cta-section" id="register" aria-labelledby="reg-cta-heading">
      <div className="register-cta-container">
        <div className="register-cta-card">
          <div className="register-cta-badge">
            {isClosed ? (
              <span className="badge-pill badge-pill--closed">
                <TbAlertCircle aria-hidden="true" /> REGISTRATIONS CLOSED
              </span>
            ) : (
              <span className="badge-pill badge-pill--live">
                <TbFlame aria-hidden="true" /> LIMITED SEATS AVAILABLE
              </span>
            )}
          </div>

          <h2 id="reg-cta-heading" className="register-cta-title">
            Ready to Build the <span className="script-accent">Future?</span>
          </h2>

          <p className="register-cta-subtitle">
            Sprint against the clock, craft groundbreaking prototypes, and present in front of industry vanguards.
            Registration takes under 90 seconds.
          </p>

          <div className="register-cta-stats">
            <div className="cta-stat">
              <TbUsers className="cta-stat__icon" aria-hidden="true" />
              <div>
                <span className="cta-stat__num">{loading ? "..." : stats.spotsLeft}</span>
                <span className="cta-stat__text">Spots remaining</span>
              </div>
            </div>
            <div className="cta-stat">
              <TbClock className="cta-stat__icon" aria-hidden="true" />
              <div>
                <span className="cta-stat__num">24h</span>
                <span className="cta-stat__text">Non-stop hackathon</span>
              </div>
            </div>
          </div>

          <div className="register-cta-actions">
            {isClosed ? (
              <div className="closed-banner">
                <p>Registration deadline has passed or capacity has been reached. Follow our socials for updates!</p>
              </div>
            ) : (
              <Link to="/register" className="btn btn--solid btn--large">
                REGISTER YOUR TEAM NOW <TbArrowRight aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
