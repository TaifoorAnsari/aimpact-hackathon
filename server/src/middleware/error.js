import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  logger.error(`Unhandled error during ${req.method} ${req.originalUrl}:`, err);

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000 || err.name === "MongoServerError") {
    const keyPattern = err.keyPattern || {};
    const keyValue = err.keyValue || {};

    if (keyPattern.teamNameKey || err.message.includes("teamNameKey")) {
      return res.status(409).json({
        error: {
          code: "DUPLICATE_TEAM_NAME",
          message: `Team name "${keyValue.teamNameKey || "submitted"}" is already taken. Please choose another name.`,
          fields: { teamName: "This team name is already taken." },
        },
      });
    }

    if (keyPattern["members.email"] || err.message.includes("members.email")) {
      const email = keyValue["members.email"] || "Provided email";
      return res.status(409).json({
        error: {
          code: "DUPLICATE_EMAIL",
          message: `Email "${email}" is already registered with another team. Each participant can join only one team.`,
          fields: { email: `"${email}" is already registered in another team.` },
        },
      });
    }

    if (keyPattern["members.phone"] || err.message.includes("members.phone")) {
      const phone = keyValue["members.phone"] || "Provided phone number";
      return res.status(409).json({
        error: {
          code: "DUPLICATE_PHONE",
          message: `Phone number "${phone}" is already registered with another team. Each participant can join only one team.`,
          fields: { phone: `"${phone}" is already registered in another team.` },
        },
      });
    }

    return res.status(409).json({
      error: {
        code: "DUPLICATE_KEY",
        message: "A unique constraint was violated with the submitted data.",
      },
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) {
      fields[key] = err.errors[key].message;
    }
    return res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
        fields,
      },
    });
  }

  const status = err.statusCode || err.status || 500;
  return res.status(status).json({
    error: {
      code: err.code || "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred. Please try again.",
    },
  });
}
