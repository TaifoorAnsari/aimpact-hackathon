import { useEffect, useState } from "react";
import { TbMenu2, TbX } from "react-icons/tb";
import { EVENT, NAV_LINKS } from "../config/event.js";

function Logo() {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="logo" aria-hidden="true" />;
  return (
    <img
      className="logo logo--img"
      src="/logo-apsit.png"
      alt="A.P. Shah Institute of Technology logo"
      onError={() => setBroken(true)}
    />
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <nav className="nav" aria-label="Main">
      <a className="nav__brand" href="#home">
        <Logo />
        <span className="nav__college">{EVENT.college}</span>
      </a>

      <ul className="nav__links">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
        <li>
          <a className="nav__cta" href="#register">
            Register
          </a>
        </li>
      </ul>

      <button
        className="nav__toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <TbX /> : <TbMenu2 />}
      </button>

      {open && (
        <ul className="nav__panel" id="mobile-menu">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav__cta" href="#register" onClick={() => setOpen(false)}>
              Register now
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
}
