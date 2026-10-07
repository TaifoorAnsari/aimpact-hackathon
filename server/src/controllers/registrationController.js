import crypto from "crypto";
import { Registration } from "../models/Registration.js";
import { generateRegId } from "../services/regId.js";
import { queueConfirmationEmail } from "../services/mail.js";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Cache for stats (30 seconds)
let cachedStats = null;
let lastStatsFetch = 0;

export async function createRegistration(req, res, next) {
  try {
    const data = req.validatedBody;

    // 1. Honeypot check
    if (data.website_hp && data.website_hp.trim() !== "") {
      logger.warn("Bot detected via honeypot field");
      return res.status(400).json({
        error: { code: "BOT_DETECTED", message: "Invalid submission detected." },
      });
    }

    // 2. Timing check (submissions under 2.5 seconds are likely automated scripts)
    if (data.formStartedAt) {
      const elapsed = Date.now() - Number(data.formStartedAt);
      if (elapsed < 2500) {
        logger.warn(`Rapid form submission detected (${elapsed}ms)`);
        return res.status(400).json({
          error: { code: "BOT_DETECTED", message: "Submission completed too fast. Please review your details." },
        });
      }
    }

    // 3. Deadline check
    const deadline = new Date(ENV.REGISTRATION_DEADLINE);
    if (new Date() > deadline) {
      return res.status(400).json({
        error: {
          code: "REGISTRATION_CLOSED",
          message: "Registrations for AIMPACT 2026 have officially closed.",
        },
      });
    }

    // 4. Capacity check
    const currentCount = await Registration.countDocuments({
      status: { $in: ["confirmed", "pending"] },
    });

    if (currentCount >= ENV.REGISTRATION_CAPACITY) {
      return res.status(400).json({
        error: {
          code: "CAPACITY_REACHED",
          message: "Registration capacity of 150 teams has been reached. Please check back for waitlist announcements.",
        },
      });
    }

    // 5. Pre-check duplicate team name
    const teamKey = data.teamName.trim().toLowerCase();
    const existingTeam = await Registration.findOne({ teamNameKey: teamKey });
    if (existingTeam) {
      return res.status(409).json({
        error: {
          code: "DUPLICATE_TEAM_NAME",
          message: `The team name "${data.teamName}" is already registered. Please choose a different name.`,
          fields: { teamName: "This team name is already taken." },
        },
      });
    }

    // 6. Pre-check duplicate emails and phones across teams
    const submittedEmails = data.members.map((m) => m.email.toLowerCase());
    const submittedPhones = data.members.map((m) => m.phone.replace(/^(?:\+91|91|0)/, ""));

    const existingMemberMatch = await Registration.findOne({
      $or: [
        { "members.email": { $in: submittedEmails } },
        { "members.phone": { $in: submittedPhones } },
      ],
    });

    if (existingMemberMatch) {
      // Find exact conflicting email or phone
      for (const m of existingMemberMatch.members) {
        if (submittedEmails.includes(m.email)) {
          return res.status(409).json({
            error: {
              code: "DUPLICATE_EMAIL",
              message: `Email "${m.email}" is already registered in team "${existingMemberMatch.teamName}". Each participant can only join one team.`,
              fields: { email: `"${m.email}" is already registered with another team.` },
            },
          });
        }
        const cleanedPhone = m.phone.replace(/^(?:\+91|91|0)/, "");
        if (submittedPhones.includes(cleanedPhone)) {
          return res.status(409).json({
            error: {
              code: "DUPLICATE_PHONE",
              message: `Phone number "${m.phone}" is already registered in team "${existingMemberMatch.teamName}". Each participant can only join one team.`,
              fields: { phone: `"${m.phone}" is already registered with another team.` },
            },
          });
        }
      }
    }

    // 7. Atomic sequence generation
    const regId = await generateRegId();

    // 8. Hash IP before storage for privacy
    const rawIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    const hashedIp = rawIp ? crypto.createHash("sha256").update(rawIp).digest("hex") : "";

    // 9. Payment status logic
    const fee = ENV.REGISTRATION_FEE;
    const initialStatus = fee > 0 ? "pending" : "confirmed";

    const registration = new Registration({
      regId,
      teamName: data.teamName.trim(),
      teamNameKey: teamKey,
      track: data.track,
      idea: data.idea?.trim() || "",
      members: data.members.map((m, idx) => ({
        ...m,
        isLeader: idx === 0,
      })),
      status: initialStatus,
      payment: {
        required: fee > 0,
        amount: fee,
        status: fee > 0 ? "pending" : "na",
      },
      consent: {
        codeOfConduct: data.consent.codeOfConduct,
        updates: data.consent.updates,
        at: new Date(),
      },
      checkedIn: false,
      ip: hashedIp,
      userAgent: req.headers["user-agent"] || "",
      source: req.query.utm_source || req.headers.referer || "direct",
    });

    await registration.save();

    // Invalidate stats cache
    cachedStats = null;

    // Send confirmation email (queued in-process, non-blocking)
    if (initialStatus === "confirmed") {
      queueConfirmationEmail(registration);
    }

    logger.info(`New registration created: ${regId} (${registration.teamName})`);

    return res.status(201).json({
      success: true,
      regId: registration.regId,
      status: registration.status,
      teamName: registration.teamName,
      track: registration.track,
      memberCount: registration.members.length,
      members: registration.members.map((m) => m.name.split(" ")[0]),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicRegistrationSummary(req, res, next) {
  try {
    const { regId } = req.params;
    const reg = await Registration.findOne({ regId }).select(
      "regId teamName track status idea createdAt members.name members.isLeader"
    );

    if (!reg) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `No registration found for ID: ${regId}`,
        },
      });
    }

    // Return strictly minimal public summary: first names only, no email or phone
    return res.json({
      regId: reg.regId,
      teamName: reg.teamName,
      track: reg.track,
      status: reg.status,
      createdAt: reg.createdAt,
      members: reg.members.map((m) => ({
        firstName: m.name.trim().split(" ")[0],
        isLeader: m.isLeader,
      })),
    });
  } catch (err) {
    next(err);
  }
}

export async function getStats(req, res, next) {
  try {
    const now = Date.now();
    if (cachedStats && now - lastStatsFetch < 30000) {
      return res.json(cachedStats);
    }

    const total = await Registration.countDocuments({
      status: { $in: ["confirmed", "pending"] },
    });
    const capacity = ENV.REGISTRATION_CAPACITY;
    const spotsLeft = Math.max(0, capacity - total);
    const deadlinePassed = new Date() > new Date(ENV.REGISTRATION_DEADLINE);
    const open = !deadlinePassed && spotsLeft > 0;

    cachedStats = {
      total,
      capacity,
      spotsLeft,
      open,
      deadline: ENV.REGISTRATION_DEADLINE,
    };
    lastStatsFetch = now;

    return res.json(cachedStats);
  } catch (err) {
    next(err);
  }
}
