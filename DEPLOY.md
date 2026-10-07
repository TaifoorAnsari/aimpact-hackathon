# Deployment Guide — AIMPACT Hackathon Website (MERN)

This guide covers production deployment of the AIMPACT Hackathon platform:
- **Client (Frontend)**: Vercel / Netlify
- **Server (API)**: Render / Railway
- **Database**: MongoDB Atlas (Free M0 Cluster)

---

## 1. MongoDB Atlas Setup

1. Create a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (**M0**).
3. Under **Security → Database Access**, create a user (e.g. `aimpact_prod`) with read/write privileges.
4. Under **Security → Network Access**, add `0.0.0.0/0` (Allow Access from Anywhere) to permit connections from Render/Railway.
5. In the cluster dashboard, click **Connect → Drivers → Node.js** and copy the connection string:
   ```
   mongodb+srv://aimpact_prod:<password>@cluster0.mongodb.net/aimpact?retryWrites=true&w=majority
   ```

---

## 2. Server Deployment (Render / Railway)

### Using Render:
1. Connect your Git repository to [Render.com](https://render.com).
2. Choose **New Web Service**.
3. Settings:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set Environment Variables in Render:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Port assigned by Render |
   | `MONGODB_URI` | `mongodb+srv://...` | MongoDB Atlas URI |
   | `CLIENT_URL` | `https://your-aimpact-client.vercel.app` | Production frontend domain |
   | `JWT_SECRET` | `generate-a-strong-random-32-char-secret` | Organizer JWT signature key |
   | `ADMIN_EMAIL` | `admin@aimpact.apsit.edu.in` | Default organizer email |
   | `ADMIN_PASSWORD` | `YourStrongSecretPassword!` | Default organizer password |
   | `MAIL_FROM` | `AIMPACT <no-reply@yourdomain.com>` | Sender address |
   | `RESEND_API_KEY` | `re_...` | Resend API key (or SMTP credentials) |
   | `REGISTRATION_CAPACITY` | `150` | Maximum allowed registered squads |
   | `REGISTRATION_DEADLINE` | `2026-10-15T23:59:00+05:30` | Registration cutoff timestamp |
   | `REGISTRATION_FEE` | `0` | Set > 0 if charging entry fee |
   | `WHATSAPP_GROUP_URL` | `https://chat.whatsapp.com/YOUR_GROUP_ID` | Official WhatsApp invite link |
   | `RAZORPAY_KEY_ID` | `rzp_live_...` | (Optional) Razorpay Key |
   | `RAZORPAY_KEY_SECRET` | `...` | (Optional) Razorpay Secret |

5. Run Seed Script: In Render Shell, execute:
   ```bash
   npm run seed:admin
   ```

---

## 3. Client Deployment (Vercel / Netlify)

### Using Vercel:
1. Connect your Git repository to [Vercel](https://vercel.com).
2. Select **Framework Preset**: `Vite`.
3. Set **Root Directory**: `client`.
4. Build & Output settings will default to:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set Environment Variables in Vercel:
   | Key | Value | Description |
   |-----|-------|-------------|
   | `VITE_API_URL` | `https://your-aimpact-api.onrender.com` | URL of the deployed backend |

6. SPA Routing:
   `client/vercel.json` is already included to automatically rewrite all paths to `/index.html`:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```

---

## 4. Cross-Site Cookies & CORS Settings

When frontend and backend are hosted on separate domains (e.g. `client.vercel.app` and `api.onrender.com`):
- `sameSite: "none"` and `secure: true` are enabled automatically in `server/src/controllers/adminController.js` whenever `NODE_ENV === "production"`.
- `cors` is configured with `credentials: true` and validates against `CLIENT_URL`.

---

## 5. Email Deliverability (SPF & DKIM)

If using a custom domain (e.g. `aimpact.apsit.edu.in`) with Resend:
1. In Resend dashboard, add your domain.
2. Add the provided DNS records at your domain registrar:
   - **SPF**: `TXT` record with value `v=spf1 include:amazonses.com ~all`
   - **DKIM**: Two `CNAME` records provided by Resend.
   - **DMARC**: `TXT` record `v=DMARC1; p=none; rua=mailto:dmarc-reports@apsit.edu.in`
