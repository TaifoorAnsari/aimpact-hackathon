# AIMPACT Hackathon website (MERN)

Phase 1: the React hero section (this folder). Phase 2: Express + MongoDB registration API.

## Run the client

```bash
cd client
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in client/dist
```

## Edit the content

All hero text, tracks, nav links and the countdown date live in `client/src/config/event.js`.

To show the real college logo, drop a file named `logo-apsit.png` into `client/public/`. Until then a teal circle placeholder is shown.

## Structure

```
client/
  src/
    components/  Hero, Navbar, OrbitStage, Countdown, Stars, Ticker
    config/      event.js
    styles/      index.css, hero.css
```
