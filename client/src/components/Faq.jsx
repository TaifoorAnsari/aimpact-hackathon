import { useState } from "react";
import { FAQS } from "../config/event.js";
import { TbHelpCircle, TbChevronDown } from "react-icons/tb";
import "../styles/faq.css";

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="faq-section" id="faq" aria-labelledby="faq-heading">
      <div className="faq-container">
        <div className="section-header">
          <span className="section-pill">
            <TbHelpCircle aria-hidden="true" /> CLARIFICATIONS
          </span>
          <h2 id="faq-heading" className="section-title">
            Frequently Asked <span className="script-accent">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about eligibility, team rules, logistics, and code ownership.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-btn-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div key={idx} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                <button
                  type="button"
                  id={buttonId}
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(idx)}
                >
                  <span className="faq-question__text">{faq.q}</span>
                  <span className="faq-question__icon" aria-hidden="true">
                    <TbChevronDown />
                  </span>
                </button>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="faq-answer-wrapper"
                  hidden={!isOpen}
                >
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
