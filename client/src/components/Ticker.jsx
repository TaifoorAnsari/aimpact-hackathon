import { TICKER_ITEMS } from "../config/event.js";

export default function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((g) => (
          <div className="ticker__group" key={g}>
            {TICKER_ITEMS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
