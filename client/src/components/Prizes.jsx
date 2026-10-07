import { PRIZES } from "../config/event.js";
import { TbTrophy, TbSparkles } from "react-icons/tb";
import "../styles/prizes.css";

export default function Prizes() {
  return (
    <section className="prizes-section" id="prizes" aria-labelledby="prizes-heading">
      <div className="prizes-container">
        <div className="section-header">
          <span className="section-pill">
            <TbSparkles aria-hidden="true" /> REWARDS & HONORS
          </span>
          <h2 id="prizes-heading" className="section-title">
            Hackathon <span className="script-accent">Prizes</span>
          </h2>
          <p className="section-subtitle">
            Compete, innovate, and showcase your engineering prowess.
          </p>
        </div>

        <div className="prizes-pool-card">
          <div className="prizes-pool-card__glow" aria-hidden="true" />
          <div className="prizes-pool-card__icon" aria-hidden="true">
            <TbTrophy />
          </div>
          <span className="prizes-pool-card__badge">EXCITING REWARDS</span>
          <div className="prizes-pool-card__amount">{PRIZES.totalPool || "₹10,000"}</div>
          <h3 className="prizes-pool-card__title">{PRIZES.title || "Total Prize Pool"}</h3>
          <p className="prizes-pool-card__desc">
            {PRIZES.description || "Cash prizes, merit certificates, and exclusive recognition for top teams."}
          </p>
        </div>
      </div>
    </section>
  );
}
