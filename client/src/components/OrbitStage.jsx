import { EVENT, TRACKS } from "../config/event.js";

export default function OrbitStage() {
  return (
    <div className="stage" aria-label="AIMPACT Hackathon Target Stage">
      {/* Target Concentric Scoring Rings */}
      <div className="stage__ring">
        {TRACKS.map((t) => (
          <span key={t.label} className="stage__chip" style={{ left: t.left, top: t.top }}>
            {t.label}
          </span>
        ))}
      </div>
      <div className="stage__ring2" aria-hidden="true" />
      <div className="stage__ring3" aria-hidden="true" />

      {/* Center Target Emblem - Perfectly centered in orbit rings */}
      <div className="stage__center">
        <h1 className="sr-only">AIMPACT Hackathon</h1>
        <div className="stage__target-wrap">
          <img
            src="/aimpact-target-logo.png"
            alt="AIMPACT Hackathon Target"
            className="stage__target-img"
            draggable="false"
          />
        </div>
      </div>
    </div>
  );
}
