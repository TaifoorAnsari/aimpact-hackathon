import mongoose from "mongoose";
import { ENV } from "../config/env.js";
import { connectDB } from "../config/db.js";
import { Admin } from "../models/Admin.js";
import { logger } from "../utils/logger.js";

async function seedAdmin() {
  await connectDB();
  try {
    const existing = await Admin.findOne({ email: ENV.ADMIN_EMAIL.toLowerCase() });
    if (existing) {
      existing.password = ENV.ADMIN_PASSWORD;
      await existing.save();
      logger.info(`Admin user updated: ${ENV.ADMIN_EMAIL}`);
    } else {
      await Admin.create({
        email: ENV.ADMIN_EMAIL.toLowerCase(),
        password: ENV.ADMIN_PASSWORD,
        name: "AIMPACT Organizer",
        role: "lead_organizer",
      });
      logger.info(`Admin user created: ${ENV.ADMIN_EMAIL}`);
    }
  } catch (err) {
    logger.error("Error seeding admin user:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
