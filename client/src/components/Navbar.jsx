import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const getHref = (href) => (isHome ? href : `/${href}`);

  return (
    <nav className="nav" aria-label="Main">
      <Link className="nav__brand" to="/">
        <Logo />
        <span className="nav__college">{EVENT.college}</span>
      </Link>

      <ul className="nav__links">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <a href={getHref(l.href)}>{l.label}</a>
          </li>
        ))}
        <li>
          <Link className="nav__cta" to="/register">
            Register
          </Link>
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
              <a href={getHref(l.href)} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link className="nav__cta" to="/register" onClick={() => setOpen(false)}>
              Register now
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
