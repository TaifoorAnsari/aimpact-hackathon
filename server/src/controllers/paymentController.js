import crypto from "crypto";
import Razorpay from "razorpay";
import { Registration } from "../models/Registration.js";
import { queueConfirmationEmail } from "../services/mail.js";
import { ENV } from "../config/env.js";
import { logger } from "../utils/logger.js";

let razorpay = null;
if (ENV.RAZORPAY_KEY_ID && ENV.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: ENV.RAZORPAY_KEY_ID,
    key_secret: ENV.RAZORPAY_KEY_SECRET,
  });
}

export async function createOrder(req, res, next) {
  try {
    if (ENV.REGISTRATION_FEE <= 0) {
      return res.status(400).json({
        error: { code: "NO_PAYMENT_REQUIRED", message: "Registration is free. No payment needed." },
      });
    }

    if (!razorpay) {
      return res.status(500).json({
        error: { code: "PAYMENT_NOT_CONFIGURED", message: "Razorpay credentials not set." },
      });
    }

    const { regId } = req.body;
    const reg = await Registration.findOne({ regId });
    if (!reg) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: `Registration ${regId} not found.` },
      });
    }

    const options = {
      amount: ENV.REGISTRATION_FEE * 100, // in paise
      currency: "INR",
      receipt: `rcpt_${reg.regId}`,
      notes: { regId: reg.regId, teamName: reg.teamName },
    };

    const order = await razorpay.orders.create(options);
    reg.payment.orderId = order.id;
    await reg.save();

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: ENV.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const webhookSecret = ENV.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (signature !== expectedSignature) {
        logger.warn("Invalid Razorpay webhook signature");
        return res.status(400).json({ error: "Invalid signature" });
      }
    }

    const event = req.body.event;
    if (event === "payment.captured") {
      const payment = req.body.payload.payment.entity;
      const orderId = payment.order_id;

      const reg = await Registration.findOne({ "payment.orderId": orderId });
      if (reg) {
        reg.status = "confirmed";
        reg.payment.status = "captured";
        reg.payment.paymentId = payment.id;
        await reg.save();

        queueConfirmationEmail(reg);
        logger.info(`Payment verified and registration confirmed for ${reg.regId}`);
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    next(err);
  }
}
