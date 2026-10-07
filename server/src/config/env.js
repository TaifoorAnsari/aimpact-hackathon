import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  MONGODB_URI: z.string().default("mongodb://127.0.0.1:27017/aimpact"),
  CLIENT_URL: z.string().default("http://localhost:5173"),
  JWT_SECRET: z.string().min(10).default("super_secret_jwt_key_aimpact_2026_dev_replace_in_prod"),
  ADMIN_EMAIL: z.string().email().default("admin@aimpact.apsit.edu.in"),
  ADMIN_PASSWORD: z.string().min(6).default("Admin@AIMPACT2026!"),
  MAIL_FROM: z.string().default('AIMPACT <no-reply@apsit.edu.in>'),
  RESEND_API_KEY: z.string().optional().default(""),
  SMTP_HOST: z.string().optional().default(""),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional().default(""),
  SMTP_PASS: z.string().optional().default(""),
  REGISTRATION_CAPACITY: z.coerce.number().default(150),
  REGISTRATION_DEADLINE: z.string().default("2026-10-15T23:59:00+05:30"),
  REGISTRATION_FEE: z.coerce.number().default(0),
  WHATSAPP_GROUP_URL: z.string().default("https://chat.whatsapp.com/TODO_AIMPACT_2026"),
  RAZORPAY_KEY_ID: z.string().optional().default(""),
  RAZORPAY_KEY_SECRET: z.string().optional().default(""),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional().default(""),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const ENV = parsed.data;
