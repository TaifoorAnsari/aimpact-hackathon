import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payments.js";
import { errorHandler } from "./middleware/error.js";
import { logger } from "./utils/logger.js";
import { Admin } from "./models/Admin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Robust CORS configuration supporting custom domain, local dev, and cloud previews
const clientUrlClean = (ENV.CLIENT_URL || "").replace(/\/$/, "");
const allowedOrigins = [
  clientUrlClean,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app") ||
        cleanOrigin.endsWith(".onrender.com") ||
        cleanOrigin.endsWith(".netlify.app")
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed: " + origin));
    },
    credentials: true,
  })
);

// Performance compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parsing with 20kb limit
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());

// Mongo query sanitizer middleware (prevents NoSQL injection by scrubbing operators)
app.use((req, res, next) => {
  const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== "object") return;
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        sanitizeObject(obj[key]);
      }
    }
  };
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
});

// Mount Routes
app.use("/api", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", app: "AIMPACT Hackathon Server", version: "1.0.0" });
});

// Serve static client assets in production (when client/dist exists)
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get("*", (req, res, next) => {
    // Preserve API routes and health check for 404 handler
    if (req.path.startsWith("/api") || req.path === "/health") {
      return next();
    }
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Central Error Handler
app.use(errorHandler);

// Automatically seed admin account on startup if it doesn't exist
async function autoSeedAdmin() {
  try {
    const existing = await Admin.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase() });
    if (!existing) {
      await Admin.create({
        email: ENV.ADMIN_EMAIL.toLowerCase(),
        password: ENV.ADMIN_PASSWORD,
        name: "AIMPACT Organizer",
        role: "lead_organizer",
      });
      logger.info(`✨ Auto-seeded default admin user: ${ENV.ADMIN_EMAIL}`);
    }
  } catch (err) {
    logger.warn(`Could not auto-seed admin: ${err.message}`);
  }
}

// Start server if executed directly as main script
const isMainModule =
  process.argv[1] &&
  (process.argv[1].replace(/\\/g, "/").endsWith("src/index.js") ||
    process.argv[1].replace(/\\/g, "/").endsWith("server/index.js"));

if (isMainModule) {
  connectDB().then(async () => {
    await autoSeedAdmin();
    app.listen(ENV.PORT, () => {
      logger.info(`🚀 AIMPACT Server running on http://localhost:${ENV.PORT}`);
    });
  });
}

export default app;
