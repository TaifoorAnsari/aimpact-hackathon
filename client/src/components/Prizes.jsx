import { PRIZES } from "../config/event.js";
import { TbTrophy, TbCrown, TbMedal, TbSparkles, TbCheck } from "react-icons/tb";
import "../styles/prizes.css";

export default function Prizes() {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <TbCrown className="trophy-gold" aria-hidden="true" />;
      case 2:
        return <TbTrophy className="trophy-silver" aria-hidden="true" />;
      case 3:
        return <TbMedal className="trophy-bronze" aria-hidden="true" />;
      default:
        return <TbTrophy aria-hidden="true" />;
    }
  };

  return (
    <section className="prizes-section" id="prizes" aria-labelledby="prizes-heading">
      <div className="prizes-container">
        <div className="section-header">
          <span className="section-pill">
            <TbSparkles aria-hidden="true" /> REWARDS & HONORS
          </span>
          <h2 id="prizes-heading" className="section-title">
            Podium & Category <span className="script-accent">Prizes</span>
          </h2>
          <p className="section-subtitle">
            Compete for cash rewards, incubation fast-tracks, industry mentorship, and recognized trophies.
          </p>
        </div>

        {/* Podium cards */}
        <div className="podium-grid">
          {PRIZES.podium.map((p) => (
            <article
              key={p.rank}
              className={`podium-card rank-${p.rank} ${p.featured ? "podium-card--featured" : ""}`}
            >
              {p.featured && <span className="featured-banner">GRAND WINNER</span>}
              <div className="podium-card__icon">{getRankIcon(p.rank)}</div>
              <span className="podium-card__rank-badge">{p.badge}</span>
              <h3 className="podium-card__title">{p.title}</h3>
              <div className="podium-card__amount">{p.amount}</div>

              <ul className="podium-card__perks">
                {p.perks.map((perk, i) => (
                  <li key={i}>
                    <TbCheck className="perk-check" aria-hidden="true" /> {perk}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* Special category row */}
        <div className="special-prizes-wrap">
          <h3 className="special-prizes-title">Special Category Awards</h3>
          <div className="special-prizes-grid">
            {PRIZES.specialCategories.map((item, idx) => (
              <div key={idx} className="special-prize-card">
                <div className="special-prize-header">
                  <TbSparkles className="special-prize-icon" aria-hidden="true" />
                  <h4>{item.title}</h4>
                </div>
                <div className="special-prize-amount">{item.amount}</div>
                <p className="special-prize-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
