import { useEffect, useRef } from "react";
import { TIMELINE } from "../config/event.js";
import { TbTarget, TbCheck } from "react-icons/tb";
import "../styles/timeline.css";

export default function Timeline() {
  const listRef = useRef(null);

  useEffect(() => {
    const items = listRef.current?.querySelectorAll(".timeline-item");
    if (!items) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((it) => it.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="timeline-section" id="timeline" aria-labelledby="timeline-heading">
      <div className="timeline-container">
        <div className="section-header">
          <span className="section-pill">
            <TbTarget aria-hidden="true" /> 8-HOUR TARGET ITINERARY
          </span>
          <h2 id="timeline-heading" className="section-title">
            The Hackathon <span className="script-accent">Timeline</span>
          </h2>
          <p className="section-subtitle">
            From team registrations through the intensive build sprint to final live evaluation.
          </p>
        </div>

        <div className="timeline-wrapper" ref={listRef}>
          <div className="timeline-spine" aria-hidden="true" />

          {TIMELINE.map((step, idx) => (
            <div
              key={idx}
              className={`timeline-item ${idx % 2 === 0 ? "timeline-item--left" : "timeline-item--right"} ${
                step.status === "completed" ? "is-completed" : ""
              }`}
            >
              <div className="timeline-node" aria-hidden="true">
                {step.status === "completed" ? <TbCheck /> : <span className="node-dot" />}
              </div>

              <div className="timeline-card">
                <span className="timeline-badge">{step.time}</span>
                <h3 className="timeline-item__title">{step.title}</h3>
                <p className="timeline-item__desc">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
