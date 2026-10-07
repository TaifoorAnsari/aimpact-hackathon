// Safe structured logger that sanitizes any PII
export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, sanitize(meta));
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, sanitize(meta));
  },
  error: (message, error = null) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error ? sanitize(error) : "");
  },
};

function sanitize(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (obj instanceof Error) {
    return { message: obj.message, stack: obj.stack };
  }
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  const sensitiveKeys = ["password", "token", "jwt", "authorization", "secret", "phone", "email"];

  for (const key of Object.keys(copy)) {
    const lowerKey = key.toLowerCase();
    if (sensitiveKeys.some((s) => lowerKey.includes(s))) {
      copy[key] = "[REDACTED]";
    } else if (typeof copy[key] === "object" && copy[key] !== null) {
      copy[key] = sanitize(copy[key]);
    }
  }
  return copy;
}
