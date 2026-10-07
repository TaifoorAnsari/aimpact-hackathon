import { TbArrowRight, TbCalendar, TbMapPin, TbTrophy } from "react-icons/tb";
import { EVENT } from "../config/event.js";
import Navbar from "./Navbar.jsx";
import Stars from "./Stars.jsx";
import OrbitStage from "./OrbitStage.jsx";
import Countdown from "./Countdown.jsx";
import Ticker from "./Ticker.jsx";

export default function Hero() {
  return (
    <header className="hero" id="home">
      <div className="hero__nebula" aria-hidden="true" />
      <Stars />
      <span className="hero__shoot" aria-hidden="true" />
      <div className="hero__planet" aria-hidden="true" />

      <Navbar />

      <main className="hero__main">
        <span className="badge">
          <i aria-hidden="true" />
          Registrations open
        </span>

        <OrbitStage />

        <p className="hero__tagline">{EVENT.tagline}</p>

        <Countdown target={EVENT.startsAt} />

        <div className="hero__cta">
          <a className="btn btn--solid" href="#register">
            REGISTER NOW <TbArrowRight aria-hidden="true" />
          </a>
          <a className="btn btn--ghost" href="#tracks">
            Tracks
          </a>
        </div>

        <div className="hero__info">
          <span className="info">
            <TbCalendar aria-hidden="true" />
            {EVENT.dateLabel}
          </span>
          <span className="info">
            <TbMapPin aria-hidden="true" />
            {EVENT.venueLabel}
          </span>
          <span className="info">
            <TbTrophy aria-hidden="true" />
            {EVENT.prizeLabel}
          </span>
        </div>
      </main>

      <Ticker />
    </header>
  );
}
