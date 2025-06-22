import express from "express";
import {
  createOrder,
  verifyPayment,
//   razorpayWebhook
} from "../controllers/payment.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyJwt,verifyPayment);
// router.post("/webhook", razorpayWebhook);        // server-side

export default router;
