import { useState } from "react";
import { EVENT, NAV_LINKS } from "../config/event.js";
import {
  TbBrandInstagram,
  TbPhone,
  TbMapPin,
  TbHeartFilled,
} from "react-icons/tb";
import "../styles/footer.css";

const SOCIAL_ICONS = {
  TbBrandInstagram: <TbBrandInstagram aria-hidden="true" />,
};

export default function Footer() {
  const [brokenApsit, setBrokenApsit] = useState(false);
  const [brokenDept, setBrokenDept] = useState(false);

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top">
          {/* Brand & Logos */}
          <div className="footer-brand">
            <div className="footer-logos">
              {!brokenDept ? (
                <img
                  src="/logo-dept.png"
                  alt="Department of CSE (AIML) - APSIT Logo"
                  className="footer-logo-img"
                  onError={() => setBrokenDept(true)}
                />
              ) : (
                <span className="footer-logo-fallback" title="APSIT AIML">
                  APSIT AIML
                </span>
              )}
            </div>

            <h3 className="footer-title">{EVENT.name} {EVENT.subtitle}</h3>
            <p className="footer-college">{EVENT.college}</p>
            <p className="footer-dept">{EVENT.department}</p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-nav-list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
              <li>
                <a href="#register">Register</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <ul className="footer-contact-list">
              <li>
                <TbPhone className="footer-icon" aria-hidden="true" />
                <span>{EVENT.contact.phone}</span>
              </li>
              <li>
                <TbMapPin className="footer-icon" aria-hidden="true" />
                <span>{EVENT.venueLabel}</span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="footer-col">
            <h4 className="footer-col-title">Connect</h4>
            <div className="footer-socials" aria-label="Social media links">
              {EVENT.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  className="social-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                >
                  {SOCIAL_ICONS[s.icon] || <TbBrandInstagram aria-hidden="true" />}
                </a>
              ))}
            </div>
            <a
              href={EVENT.whatsappGroupUrl}
              className="footer-whatsapp-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Official WhatsApp Group &rarr;
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {EVENT.name} Hackathon. Organized by{" "}
            <strong>{EVENT.department}</strong>, {EVENT.college}.
          </p>
          <p className="footer-credit">
            Engineered with <TbHeartFilled className="heart-icon" aria-hidden="true" /> for innovators nationwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
