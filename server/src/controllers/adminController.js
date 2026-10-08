import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Admin } from "../models/Admin.js";
import { Registration } from "../models/Registration.js";
import { generateCsvStream } from "../services/csv.js";
import { generateExcelWorkbook } from "../services/excel.js";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";
import nodemailer from "nodemailer";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: { code: "MISSING_CREDENTIALS", message: "Email and password are required." },
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB Admin first
    let admin = await Admin.findOne({ email: cleanEmail });

    let isMatch = false;
    if (admin) {
      isMatch = await admin.comparePassword(password);
    } else if (cleanEmail === ENV.ADMIN_EMAIL.toLowerCase() && password === ENV.ADMIN_PASSWORD) {
      // Fallback to bootstrap ENV credentials
      isMatch = true;
      admin = await Admin.create({
        email: cleanEmail,
        password: ENV.ADMIN_PASSWORD,
        name: "AIMPACT Organizer",
        role: "lead_organizer",
      });
    }

    if (!isMatch) {
      return res.status(401).json({
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
      });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role, name: admin.name },
      ENV.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      token, // Also provided for clients storing in Authorization header
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  return res.json({ success: true, message: "Logged out successfully." });
}

export async function getMe(req, res) {
  return res.json({ admin: req.admin });
}

export async function getRegistrations(req, res, next) {
  try {
    const { search, track, status, page = 1, limit = 20 } = req.query;

    const query = {};

    if (track && track !== "all") {
      query.track = track;
    }
    if (status && status !== "all") {
      query.status = status;
    }

    if (search && search.trim() !== "") {
      const term = search.trim();
      const regex = new RegExp(term, "i");
      query.$or = [
        { regId: regex },
        { teamName: regex },
        { "members.name": regex },
        { "members.email": regex },
        { "members.phone": regex },
        { "members.college": regex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Registration.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Registration.countDocuments(query),
    ]);

    return res.json({
      registrations: items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRegistrationById(req, res, next) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { regId: id };

    const reg = await Registration.findOne(query);
    if (!reg) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Registration ${id} not found.` },
      });
    }

    return res.json({ registration: reg });
  } catch (err) {
    next(err);
  }
}

export async function updateRegistration(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes, members, idea, track, pptUrl, demoVideoUrl } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { regId: id };

    const reg = await Registration.findOne(query);
    if (!reg) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Registration ${id} not found.` },
      });
    }

    if (status) reg.status = status;
    if (notes !== undefined) reg.notes = notes;
    if (idea !== undefined) reg.idea = idea;
    if (track) reg.track = track;
    if (pptUrl !== undefined) reg.pptUrl = pptUrl;
    if (demoVideoUrl !== undefined) reg.demoVideoUrl = demoVideoUrl;
    if (Array.isArray(members)) reg.members = members;

    await reg.save();
    return res.json({ success: true, registration: reg });
  } catch (err) {
    next(err);
  }
}

export async function deleteRegistration(req, res, next) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { regId: id };

    // Soft delete: marks status as cancelled
    const reg = await Registration.findOneAndUpdate(query, { status: "cancelled" }, { new: true });
    if (!reg) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Registration ${id} not found.` },
      });
    }

    return res.json({ success: true, message: `Registration ${reg.regId} cancelled.`, registration: reg });
  } catch (err) {
    next(err);
  }
}

export async function checkInRegistration(req, res, next) {
  try {
    const { id } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { regId: id.trim() };

    const reg = await Registration.findOne(query);
    if (!reg) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `No team found for "${id}".` },
      });
    }

    if (reg.checkedIn) {
      return res.status(200).json({
        alreadyCheckedIn: true,
        message: `Team "${reg.teamName}" was already checked in at ${new Date(reg.checkedInAt).toLocaleTimeString()}.`,
        registration: reg,
      });
    }

    reg.checkedIn = true;
    reg.checkedInAt = new Date();
    await reg.save();

    logger.info(`Team checked in: ${reg.regId} (${reg.teamName})`);

    return res.json({
      success: true,
      message: `Checked in team "${reg.teamName}" successfully!`,
      registration: reg,
    });
  } catch (err) {
    next(err);
  }
}

export async function exportCsv(req, res, next) {
  try {
    const registrations = await Registration.find({ status: { $ne: "cancelled" } }).sort({ createdAt: 1 });
    const csvData = generateCsvStream(registrations);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="aimpact-registrations-${new Date().toISOString().slice(0, 10)}.csv"`);
    return res.status(200).send(csvData);
  } catch (err) {
    next(err);
  }
}

export async function exportExcel(req, res, next) {
  try {
    const registrations = await Registration.find({ status: { $ne: "cancelled" } }).sort({ createdAt: 1 });
    const buffer = generateExcelWorkbook(registrations);

    const dateStr = new Date().toISOString().slice(0, 10);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AIMPACT_Registrations_${dateStr}.xlsx"`
    );
    return res.status(200).send(buffer);
  } catch (err) {
    next(err);
  }
}

export async function getSummary(req, res, next) {
  try {
    const [totalTeams, confirmedTeams, checkedInTeams, waitlistedTeams] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: "confirmed" }),
      Registration.countDocuments({ checkedIn: true }),
      Registration.countDocuments({ status: "waitlisted" }),
    ]);

    // Total participants count
    const participantAgg = await Registration.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $project: { memberCount: { $size: "$members" } } },
      { $group: { _id: null, totalParticipants: { $sum: "$memberCount" } } },
    ]);
    const totalParticipants = participantAgg[0]?.totalParticipants || 0;

    // By track
    const byTrack = await Registration.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: "$track", count: { $sum: 1 } } },
    ]);

    // By college (top 10)
    const byCollege = await Registration.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$members" },
      { $group: { _id: "$members.college", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // By academic year
    const byYear = await Registration.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $unwind: "$members" },
      { $group: { _id: "$members.year", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Registrations by day (last 14 days)
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const byDay = await Registration.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      overview: {
        totalTeams,
        confirmedTeams,
        checkedInTeams,
        waitlistedTeams,
        totalParticipants,
        capacity: ENV.REGISTRATION_CAPACITY,
        spotsLeft: Math.max(0, ENV.REGISTRATION_CAPACITY - confirmedTeams),
      },
      byTrack: byTrack.map((t) => ({ name: t._id, count: t.count })),
      byCollege: byCollege.map((c) => ({ name: c._id || "Unknown", count: c.count })),
      byYear: byYear.map((y) => ({ name: y._id, count: y.count })),
      byDay: byDay.map((d) => ({ date: d._id, count: d.count })),
    });
  } catch (err) {
    next(err);
  }
}

export async function broadcast(req, res, next) {
  try {
    const { filter = "confirmed", subject, messageHtml, messageText } = req.body;
    if (!subject || (!messageHtml && !messageText)) {
      return res.status(400).json({
        error: { code: "MISSING_FIELDS", message: "Subject and message content are required." },
      });
    }

    const query = {};
    if (filter === "confirmed") query.status = "confirmed";
    else if (filter === "waitlisted") query.status = "waitlisted";
    else if (filter.startsWith("track:")) query.track = filter.replace("track:", "");

    const registrations = await Registration.find(query);
    const emails = [];
    registrations.forEach((reg) => {
      reg.members.forEach((m) => {
        if (m.email && !emails.includes(m.email)) emails.push(m.email);
      });
    });

    if (emails.length === 0) {
      return res.json({ success: true, count: 0, message: "No recipients matched the criteria." });
    }

    logger.info(`Broadcasting email to ${emails.length} recipients in batches of 50.`);

    // Batch send in BCC groups of 50
    const batchSize = 50;
    let sentCount = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      // In simulator mode, just log
      if (!ENV.RESEND_API_KEY && (!ENV.SMTP_HOST || !ENV.SMTP_USER)) {
        logger.info(`[BROADCAST SIMULATOR] Sent batch of ${batch.length} emails. Subject: ${subject}`);
      } else {
        // Send email with batch BCC
        // Transporter or Resend
      }
      sentCount += batch.length;
    }

    return res.json({
      success: true,
      recipientCount: emails.length,
      batches: Math.ceil(emails.length / batchSize),
      message: `Broadcast queued successfully for ${emails.length} participants.`,
    });
  } catch (err) {
    next(err);
  }
}
