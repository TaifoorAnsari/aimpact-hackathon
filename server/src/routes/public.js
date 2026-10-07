import { Router } from "express";
import {
  createRegistration,
  getPublicRegistrationSummary,
  getStats,
} from "../controllers/registrationController.js";
import { registrationLimiter } from "../middleware/rateLimit.js";
import { validateBody, registrationValidationSchema } from "../middleware/validate.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AIMPACT API",
    time: new Date().toISOString(),
  });
});

router.get("/stats", getStats);

router.get("/registrations/:regId", getPublicRegistrationSummary);

router.post(
  "/registrations",
  registrationLimiter,
  validateBody(registrationValidationSchema),
  createRegistration
);

export default router;
