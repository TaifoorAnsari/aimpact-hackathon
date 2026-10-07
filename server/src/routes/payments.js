import { Router } from "express";
import { createOrder, handleWebhook } from "../controllers/paymentController.js";

const router = Router();

router.post("/order", createOrder);
router.post("/webhook", handleWebhook);

export default router;
