import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  markAsDelivered,
  markAsPaid
} from "../controllers/order.controller.js";
import { isAdmin, verifyJwt } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", verifyJwt, createOrder);
router.get("/my-orders", verifyJwt, getMyOrders);
router.get("/admin/all", verifyJwt, isAdmin, getAllOrders);
router.patch("/admin/:orderId/deliver", verifyJwt, isAdmin, markAsDelivered);
router.patch("/:orderId/pay", verifyJwt, markAsPaid);

export default router;
