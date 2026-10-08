import { TRACKS } from "../config/event.js";
import { TbSchool, TbHeartRateMonitor, TbArrowRight, TbCpu } from "react-icons/tb";
import "../styles/tracks.css";

const TRACK_ICONS = {
  "ai-education": <TbSchool aria-hidden="true" />,
  "ai-healthcare": <TbHeartRateMonitor aria-hidden="true" />,
};

export default function Tracks() {
  return (
    <section className="tracks-section" id="tracks" aria-labelledby="tracks-heading">
      <div className="tracks-container">
        <div className="section-header">
          <span className="section-pill">CHALLENGE SPHERES</span>
          <h2 id="tracks-heading" className="section-title">
            Two High-Impact <span className="script-accent">Tracks</span>
          </h2>
          <p className="section-subtitle">
            Choose your battleground. Prototype AI solutions that shift paradigms in education and healthcare.
          </p>
        </div>

        <div className="tracks-grid">
          {TRACKS.map((t) => (
            <article key={t.id} className="track-card">
              <div className="track-card__glow" aria-hidden="true" />
              <div className="track-card__icon-wrap">
                {TRACK_ICONS[t.id] || <TbCpu aria-hidden="true" />}
              </div>

              <h3 className="track-card__title">{t.label}</h3>
              <p className="track-card__blurb">{t.blurb}</p>

              <div className="track-card__tags" aria-label={`Keywords for ${t.label}`}>
                {t.tags?.map((tag) => (
                  <span key={tag} className="track-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <a href="#register" className="track-card__link">
                Register for {t.shortTitle || t.label} <TbArrowRight aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
