import { EVENT, TRACKS } from "../config/event.js";

export default function OrbitStage() {
  return (
    <div className="stage">
      <div className="stage__ring">
        {TRACKS.map((t) => (
          <span key={t.label} className="stage__chip" style={{ left: t.left, top: t.top }}>
            {t.label}
          </span>
        ))}
      </div>
      <div className="stage__ring2" aria-hidden="true" />
      <div className="stage__ring3" aria-hidden="true" />
      <div className="stage__center">
        <div className="stage__the">THE</div>
        <h1 className="stage__title">{EVENT.name}</h1>
        <div className="stage__script">{EVENT.subtitle}</div>
      </div>
    </div>
  );
}
