import { ABOUT, EVENT } from "../config/event.js";
import { TbClock, TbUsers, TbTrophy, TbSparkles } from "react-icons/tb";
import "../styles/about.css";

export default function About() {
  const statIcons = [
    <TbClock key="clock" aria-hidden="true" />,
    <TbUsers key="users" aria-hidden="true" />,
    <TbTrophy key="trophy" aria-hidden="true" />,
  ];

  return (
    <section className="about-section" id="about" aria-labelledby="about-heading">
      <div className="about-container">
        <div className="section-header">
          <span className="section-pill">
            <TbSparkles aria-hidden="true" /> ABOUT THE HACKATHON
          </span>
          <h2 id="about-heading" className="section-title">
            Where Ambition Meets <span className="script-accent">Creation</span>
          </h2>
          <p className="section-subtitle">{EVENT.college}</p>
        </div>

        <div className="about-content">
          <div className="about-narrative">
            <h3 className="about-subheading">{ABOUT.heading}</h3>
            {ABOUT.paragraphs.map((p, idx) => (
              <p key={idx} className="about-p">
                {p}
              </p>
            ))}
          </div>

          <div className="about-stats-grid" role="list" aria-label="Hackathon quick stats">
            {ABOUT.stats.map((stat, idx) => (
              <div key={idx} className="stat-card" role="listitem">
                <div className="stat-card__icon">{statIcons[idx]}</div>
                <div className="stat-card__value">{stat.value}</div>
                <div className="stat-card__label">{stat.label}</div>
                <div className="stat-card__detail">{stat.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
