import { MASTERCLASSES } from "../config/event.js";
import { TbVideo, TbUserCheck, TbClock, TbCheck, TbSparkles } from "react-icons/tb";
import "../styles/masterclass.css";

export default function Masterclass() {
  return (
    <section className="masterclass-section" id="masterclass" aria-labelledby="masterclass-heading">
      <div className="masterclass-container">
        <div className="section-header">
          <span className="section-pill">
            <TbVideo aria-hidden="true" /> EXPERT PRE-SESSIONS
          </span>
          <h2 id="masterclass-heading" className="section-title">
            Pre-Hackathon <span className="script-accent">Masterclasses</span>
          </h2>
          <p className="section-subtitle">
            Tune in before hack day. Learn insider judging criteria and battle-tested execution strategies directly from industry leaders.
          </p>
        </div>

        <div className="masterclass-grid">
          {MASTERCLASSES.map((session) => (
            <article key={session.id} className="masterclass-card">
              <div className="masterclass-tag">
                <TbSparkles aria-hidden="true" /> VIRTUAL WORKSHOP
              </div>

              <h3 className="masterclass-title">{session.title}</h3>

              <div className="masterclass-meta">
                <div className="meta-item">
                  <TbUserCheck className="meta-icon" aria-hidden="true" />
                  <div>
                    <strong className="speaker-name">{session.speaker}</strong>
                    <span className="speaker-role">{session.role}</span>
                  </div>
                </div>
                <div className="meta-item">
                  <TbClock className="meta-icon" aria-hidden="true" />
                  <span>{session.time}</span>
                </div>
              </div>

              <p className="masterclass-summary">{session.summary}</p>

              <div className="masterclass-topics">
                <span className="topics-label">Key takeaways:</span>
                <ul>
                  {session.topics.map((t, idx) => (
                    <li key={idx}>
                      <TbCheck className="topic-check" aria-hidden="true" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
