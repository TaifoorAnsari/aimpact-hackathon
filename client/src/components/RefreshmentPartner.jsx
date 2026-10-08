import { REFRESHMENT_PARTNER } from "../config/event.js";
import { TbBolt, TbCheck, TbExternalLink, TbFlame } from "react-icons/tb";
import "../styles/partner.css";

export default function RefreshmentPartner() {
  const p = REFRESHMENT_PARTNER;

  return (
    <section className="partner-section" id="partner" aria-labelledby="partner-heading">
      <div className="partner-container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-pill">
            <TbBolt aria-hidden="true" /> {p.tag}
          </span>
          <h2 id="partner-heading" className="section-title">
            Fueled by <span className="script-accent">{p.brandName}</span>
          </h2>
          <p className="section-subtitle">
            {p.tagline}. High-voltage focus and zero-crash stamina for every hacker.
          </p>
        </div>

        {/* Feature Spotlight Card */}
        <div className="partner-card">
          {/* Product Visual Showcase */}
          <div className="partner-visual">
            <div className="partner-visual__glow" aria-hidden="true" />
            <div className="partner-visual__frame">
              <img
                src={p.image}
                alt={`${p.brandName} ${p.productName}`}
                className="partner-product-img"
                loading="lazy"
              />
              <div className="partner-visual__badge">
                <TbFlame aria-hidden="true" />
                <span>75mg Plant Caffeine • Zero Sugar</span>
              </div>
            </div>
          </div>

          {/* Partner Details & Value */}
          <div className="partner-content">
            <div className="partner-brand-header">
              <a
                href={p.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-logo-link"
                title="Visit 3Sisters Drinks"
              >
                <img
                  src={p.logo}
                  alt={p.brandName}
                  className="partner-logo-img"
                />
              </a>
              <span className="partner-category-pill">OFFICIAL ENERGIZER</span>
            </div>

            <h3 className="partner-product-name">{p.productName}</h3>

            <p className="partner-description">{p.description}</p>

            {/* Quick Stats Grid */}
            <div className="partner-stats-grid">
              {p.stats.map((stat, idx) => (
                <div key={idx} className="partner-stat-item">
                  <span className="partner-stat-value">{stat.value}</span>
                  <strong className="partner-stat-label">{stat.label}</strong>
                  <small className="partner-stat-detail">{stat.detail}</small>
                </div>
              ))}
            </div>

            {/* Features Checkpoints */}
            <div className="partner-features">
              <span className="partner-features-title">HACKATHON FUEL SPECS:</span>
              <ul className="partner-features-list">
                {p.features.map((feat, idx) => (
                  <li key={idx} className="partner-feature-row">
                    <TbCheck className="partner-check-icon" aria-hidden="true" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="partner-actions">
              <a
                href={p.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--solid partner-cta-btn"
              >
                <span>Order No Bullsh*t Drink</span>
                <TbExternalLink aria-hidden="true" />
              </a>
              <a
                href={p.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--ghost partner-cta-btn"
              >
                <span>Visit 3Sisters Store</span>
                <TbExternalLink aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
