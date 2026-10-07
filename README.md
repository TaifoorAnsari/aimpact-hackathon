# AIMPACT 2026 Hackathon Platform (MERN)

A complete, production-ready full-stack registration and organizer operations platform for **AIMPACT 2026** at A.P. Shah Institute of Technology (APSIT), Thane.

Optimized for high-concurrency mobile registration: **a team of 2–4 can register in under 90 seconds on a phone, and organizers can monitor, filter, check in, and export registrations in real time.**

---

## Tech Stack & Architecture

- **Frontend (`client/`)**: Vite, React 18, React Router v6, Plain CSS (`styles/*.css`), `recharts` for organizer analytics, `react-icons`.
- **Backend (`server/`)**: Node.js 20, Express 4 (ES modules), Mongoose 8 (MongoDB), Zod schema validation, Helmet, strict CORS, rate-limiting, bcryptjs, JWT authentication in `httpOnly` cookies, Nodemailer / Resend email service, `json2csv` streaming.
- **Design Tokens**: Crimson Nebula background (`--bg: #0d0409`), Teal Glow accents (`--teal: #6fc7d1`, `--teal-soft: #7fd3dc`), Ice White (`--ice: #bff4ff`), Rose typography (`--rose: #e6c3ca`), Orbitron display font, Mea Culpa script accents, Inter body font.

---

## Directory Structure

```
aimpact-hackathon/
  ├── package.json              <- Root scripts (dev, build, start, seed, test)
  ├── DEPLOY.md                 <- Step-by-step production deployment guide
  ├── client/
  │   ├── index.html            <- SEO, OpenGraph & Twitter cards
  │   ├── package.json
  │   ├── vercel.json           <- SPA rewrite rules for Vercel
  │   ├── public/               <- Assets & logo fallbacks (logo-apsit.png, logo-dept.png)
  │   └── src/
  │       ├── main.jsx, App.jsx <- React root & code-split lazy routes
  │       ├── config/
  │       │   └── event.js      <- SINGLE SOURCE OF TRUTH (copy, tracks, prizes, dates)
  │       ├── components/       <- Hero, Navbar, About, Tracks, Timeline, Prizes,
  │       │                        Masterclass, Faq, RegisterCta, Footer, Countdown, Ticker
  │       ├── pages/            <- LandingPage, RegisterPage, SuccessPage, AdminLoginPage,
  │       │                        AdminDashboardPage, AdminCheckinPage
  │       └── styles/           <- Plain CSS modular stylesheets per section
  └── server/
      ├── package.json
      ├── .env.example
      ├── src/
      │   ├── index.js          <- Express app bootstrap & security
      │   ├── config/           <- env.js (Zod-validated), db.js (Mongoose)
      │   ├── models/           <- Registration.js, Counter.js, Admin.js
      │   ├── controllers/      <- registrationController.js, adminController.js, paymentController.js
      │   ├── middleware/       <- auth.js, rateLimit.js, validate.js, error.js
      │   ├── routes/           <- public.js, admin.js, payments.js
      │   ├── services/         <- mail.js (branded email + retry), regId.js (atomic IDs), csv.js
      │   ├── utils/            <- logger.js (safe, non-PII logger)
      │   └── scripts/          <- seedAdmin.js
      └── tests/                <- schemas.test.js, regId.test.js, registration.test.js
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 20+ installed
- MongoDB running locally on `mongodb://127.0.0.1:27017` (or MongoDB Atlas URI)

### 2. Install Dependencies
```bash
# In the root repository
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Setup Environment Variables
```bash
# Backend environment
cp server/.env.example server/.env

# Frontend environment
cp client/.env.example client/.env
```

### 4. Seed the Organizer Admin Account
```bash
npm run seed:admin
```
Default credentials from `.env`:
- **Email**: `admin@aimpact.apsit.edu.in`
- **Password**: `Admin@AIMPACT2026!`

### 5. Run Client and Server Together
```bash
npm run dev
```
- **Client (Frontend)**: `http://localhost:5173`
- **Server (API)**: `http://localhost:5000`
- **Admin Dashboard**: `http://localhost:5173/admin`
- **Event Day Desk Check-in**: `http://localhost:5173/admin/checkin`

---

## Testing

Run unit tests (Zod schema validation, atomic `regId` sequencing) and integration tests (`POST /api/registrations`, duplicate email rejection, capacity limits):

```bash
npm run test
```

---

## Organizer Check-In on Event Day

1. Navigate to `http://localhost:5173/admin/login` (or your production domain).
2. Log in using organizer credentials.
3. Open **Desk Check-in** (`/admin/checkin`).
4. As teams arrive at the registration desk, enter their **Registration ID** (e.g. `AIM-2026-0001` from their confirmation email or pass) into the input box and click **Verify**.
   - **Green Banner**: Instant verification, displays team leader, college, and squad roster.
   - **Yellow Banner**: Alerts if team was already checked in (shows previous check-in time).
   - **Red Banner**: Unregistered or invalid ID.
5. Click **Export CSV** at any time to stream a complete `.csv` spreadsheet of all confirmed participants.

---

## Production Deployment

Detailed deployment instructions for Vercel, Render, and MongoDB Atlas are documented in [`DEPLOY.md`](./DEPLOY.md).
