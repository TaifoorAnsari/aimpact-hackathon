import { Link } from "react-router-dom";
import { TbArrowRight, TbCalendar, TbMapPin, TbTrophy, TbTarget, TbUsers } from "react-icons/tb";
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


      <Navbar />

      <main className="hero__main">
        <span className="badge">
          <TbTarget className="badge__icon" aria-hidden="true" />
          Registrations Open: {EVENT.registrationWindow || "Oct 10 – Oct 14"}
        </span>

        <OrbitStage />

        <p className="hero__tagline">{EVENT.tagline}</p>

        <Countdown target={EVENT.startsAt} />

        <div className="hero__cta">
          <Link className="btn btn--solid" to="/register">
            REGISTER NOW <TbArrowRight aria-hidden="true" />
          </Link>
          <a className="btn btn--ghost" href="#tracks">
            <TbTarget aria-hidden="true" /> Tracks
          </a>
        </div>

        <div className="hero__info">
          <span className="info">
            <TbUsers aria-hidden="true" />
            Team Size: 3-4 (Inter-Dept)
          </span>
          <span className="info">
            <TbCalendar aria-hidden="true" />
            {EVENT.dateLabel}
          </span>
          <span className="info">
            <TbTrophy aria-hidden="true" />
            {EVENT.prizeLabel}
          </span>
          <span className="info">
            <TbMapPin aria-hidden="true" />
            {EVENT.venueLabel}
          </span>
        </div>
      </main>

      <Ticker />
    </header>
  );
}
