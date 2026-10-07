import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TbMenu2, TbX } from "react-icons/tb";
import { EVENT, NAV_LINKS } from "../config/event.js";

function Logo() {
  const [broken, setBroken] = useState(false);
  if (broken) return <span className="nav__logo nav__logo--fallback" aria-hidden="true" />;
  return (
    <img
      className="nav__logo"
      src="/logo-dept.png"
      alt="Department of CSE (AIML) - APSIT"
      width="38"
      height="38"
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
      <Link className="nav__brand" to="/" aria-label="Department of Artificial Intelligence & Machine Learning(AI&ML), A.P. Shah Institute of Technology">
        <Logo />
        <div className="nav__brand-text">
          <span className="nav__brand-dept">Department of Artificial Intelligence &amp; Machine Learning(AI&amp;ML),</span>
          <span className="nav__brand-inst">A.P. Shah Institute of Technology</span>
        </div>
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
