import { useEffect, useState } from "react";

function diff(target) {
  const ms = Math.max(0, new Date(target).getTime() - Date.now());
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hrs: Math.floor((s % 86400) / 3600),
    min: Math.floor((s % 3600) / 60),
    sec: s % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

export default function Countdown({ target }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells = [
    ["days", t.days],
    ["hrs", t.hrs],
    ["min", t.min],
    ["sec", t.sec],
  ];

  return (
    <div className="cd" role="timer" aria-label="Time left until the hackathon starts">
      {cells.map(([label, value]) => (
        <div className="cd__cell" key={label}>
          <span className="cd__num">{pad(value)}</span>
          <small>{label}</small>
        </div>
      ))}
    </div>
  );
}
