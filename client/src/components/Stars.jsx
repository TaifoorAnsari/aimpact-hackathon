import { useMemo } from "react";

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Stars({ count = 70 }) {
  const stars = useMemo(() => {
    const rand = mulberry32(2026);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + Math.round(rand() * 2),
      delay: rand() * 3,
      dur: 2.5 + rand() * 2.5,
    }));
  }, [count]);

  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="stars__s"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
