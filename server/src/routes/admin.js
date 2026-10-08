import { Router } from "express";
import {
  login,
  logout,
  getMe,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
  checkInRegistration,
  exportCsv,
  exportExcel,
  getSummary,
  broadcast,
} from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";
import { loginLimiter } from "../middleware/rateLimit.js";

const router = Router();

// Public auth routes
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

// Protected routes
router.use(requireAdmin);

router.get("/me", getMe);
router.get("/registrations", getRegistrations);
router.get("/registrations/:id", getRegistrationById);
router.patch("/registrations/:id", updateRegistration);
router.delete("/registrations/:id", deleteRegistration);
router.post("/registrations/:id/check-in", checkInRegistration);
router.get("/export.xlsx", exportExcel);
router.get("/export.csv", exportCsv);
router.get("/summary", getSummary);
router.post("/broadcast", broadcast);

export default router;
