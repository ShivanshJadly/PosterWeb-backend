import express from "express";
import {
  createOrder,
  verifyPayment,
//   razorpayWebhook
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
// router.post("/webhook", razorpayWebhook);        // server-side

export default router;
