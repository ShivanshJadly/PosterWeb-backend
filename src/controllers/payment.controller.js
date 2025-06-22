import { razorpay } from "../utils/razorpay.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";
import { Orders } from "../models/order.model.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  const options = {
    amount: amount * 100,
    currency,
    receipt: `receipt_order_${Date.now()}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  return res.status(200).json(
    new ApiResponse(200, order, "Order created successfully")
  );
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    amount,
    orderItems,
    shippingAddress,
    paymetMethod,
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid signature, payment verification failed");
  }

  const newOrder = await Orders.create({
    customer: req.user._id,
    orderItems: orderItems.map((item) => ({
      productId: item.posterId,
      quantity: item.quantity,
      posterSize: item.size,
    })),
    shippingAddress,
    paymetMethod: paymetMethod || "Online",
    paymetStatus: "PAID",
    totalPrice: amount,
  });

  return res.status(200).json(
    new ApiResponse(200, { razorpay_order_id, razorpay_payment_id, newOrder }, "Payment verified")
  );
});

// export const razorpayWebhook = asyncHandler(async (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

//   const shasum = crypto.createHmac("sha256", secret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   const signature = req.headers["x-razorpay-signature"];

//   if (digest !== signature) {
//     return res.status(400).json({ success: false, message: "Invalid webhook signature" });
//   }

//   const event = req.body.event;

//   if (event === "payment.captured") {
//     // Update your DB, e.g., mark order as paid
//   }

//   res.status(200).json({ received: true });
// });
