import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { Registration } from "../models/Registration.js";
import { Counter } from "../models/Counter.js";
import { Admin } from "../models/Admin.js";
import { logger } from "../utils/logger.js";

async function clearRegistrations() {
  await connectDB();
  try {
    const regCount = await Registration.countDocuments();
    const counterCount = await Counter.countDocuments();
    const adminCount = await Admin.countDocuments();

    logger.info(`Found ${regCount} registration(s) and ${counterCount} counter(s).`);

    // 1. Delete all registrations
    const regResult = await Registration.deleteMany({});
    logger.info(`Successfully deleted ${regResult.deletedCount} registration document(s).`);

    // 2. Reset counter sequence so new official registrations start at AIM-2026-0001
    const counterResult = await Counter.deleteMany({});
    logger.info(`Successfully reset ${counterResult.deletedCount} sequence counter(s). Next registration ID will be AIM-2026-0001.`);

    // 3. Confirm admin accounts are safe
    logger.info(`Admin collection left untouched (${adminCount} admin accounts preserved).`);

    console.log("\n========================================================");
    console.log(" Database is now completely CLEAN for official launch!");
    console.log(" Registrations deleted:", regResult.deletedCount);
    console.log(" ID Sequence reset: Next team gets AIM-2026-0001");
    console.log(" Admin account(s) preserved:", adminCount);
    console.log("========================================================\n");
  } catch (err) {
    logger.error("Error clearing registration database:", err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

clearRegistrations();
