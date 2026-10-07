import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export function requireAdmin(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      token = parts[1];
    }
  }

  if (!token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required to access organizer dashboard.",
      },
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: {
        code: "INVALID_TOKEN",
        message: "Your organizer session has expired or is invalid. Please log in again.",
      },
    });
  }
}
