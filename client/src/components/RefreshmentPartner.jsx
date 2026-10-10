import { SPONSORS } from "../config/event.js";
import { TbSparkles, TbBolt, TbIceCream, TbFlame, TbCheck, TbExternalLink } from "react-icons/tb";
import "../styles/partner.css";

export default function RefreshmentPartner() {
  return (
    <section className="partner-section" id="sponsors" aria-labelledby="sponsors-heading">
      <div className="partner-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-pill">
            <TbSparkles aria-hidden="true" /> OFFICIAL SPONSORS &amp; PARTNERS
          </span>
          <h2 id="sponsors-heading" className="section-title">
            Fueled &amp; Sweetened by <span className="script-accent">Our Sponsors</span>
          </h2>
          <p className="section-subtitle">
            Powering 8 hours of intensive engineering ingenuity with refreshing drinks, creative energy, and real dairy treats.
          </p>
        </div>

        {/* Side-by-Side Dual Sponsors Grid */}
        <div className="sponsors-grid">
          {SPONSORS.map((s) => (
            <article key={s.id} className={`sponsor-card sponsor-card--${s.accent || "cyan"}`}>
              {/* Card Header Bar */}
              <div className="sponsor-card__header">
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-card__logo-wrap"
                  title={`Visit ${s.brandName}`}
                >
                  <img src={s.logo} alt={s.brandName} className="sponsor-card__logo" />
                </a>
                <span className={`sponsor-badge sponsor-badge--${s.accent || "cyan"}`}>
                  {s.id === "3sisters" ? <TbBolt aria-hidden="true" /> : <TbIceCream aria-hidden="true" />}
                  {s.tag}
                </span>
              </div>

              {/* Visual Spotlight Frame */}
              <div className="sponsor-card__visual">
                <div className="sponsor-card__glow" aria-hidden="true" />
                <div className="sponsor-card__frame">
                  <img
                    src={s.image}
                    alt={`${s.brandName} - ${s.productName}`}
                    className="sponsor-card__img"
                    loading="lazy"
                  />
                  <div className="sponsor-card__overlay-pill">
                    {s.id === "3sisters" ? <TbFlame aria-hidden="true" /> : <TbIceCream aria-hidden="true" />}
                    <span>{s.badgeText}</span>
                  </div>
                </div>
              </div>

              {/* Body Content */}
              <div className="sponsor-card__body">
                <h3 className="sponsor-card__title">{s.productName}</h3>
                <span className="sponsor-card__tagline">{s.tagline}</span>
                <p className="sponsor-card__desc">{s.description}</p>

                {/* 2x2 Stats Grid */}
                <div className="sponsor-stats-grid">
                  {s.stats.map((st, idx) => (
                    <div key={idx} className="sponsor-stat-cell">
                      <span className="sponsor-stat-num">{st.value}</span>
                      <span className="sponsor-stat-label">{st.label}</span>
                    </div>
                  ))}
                </div>

                {/* Key Checklist */}
                <ul className="sponsor-features-list">
                  {s.features.map((feat, idx) => (
                    <li key={idx} className="sponsor-feature-item">
                      <TbCheck className="sponsor-check-icon" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="sponsor-card__footer">
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn sponsor-cta-btn ${s.accent === "rose" ? "btn--solid-rose" : "btn--solid"}`}
                >
                  <span>{s.linkLabel}</span>
                  <TbExternalLink aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
