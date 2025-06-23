import { Orders } from "../models/order.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

// Get All Orders (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Orders.find()
    .populate("customer", "fullName email")
    .populate("orderItems.productId", "title price")
    .populate("orderItems.posterSize")

  return res.status(200).json(
    new ApiResponse(200, orders, "All orders fetched")
  );
});

// Get Orders for Logged-in User
export const getMyOrders = asyncHandler(async (req, res) => {
  const myOrders = await Orders.find({ customer: req.user._id })
    .populate("orderItems.productId", "title price posterImage")
    .populate("orderItems.posterSize")

  return res.status(200).json(
    new ApiResponse(200, myOrders, "User orders fetched")
  );
});

// Update Order Delivery Status (Admin)
export const markAsDelivered = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Orders.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.isDelivered = true;
  order.deliverAt = new Date();
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order marked as delivered")
  );
});

// after razorpay verification
export const markAsPaid = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Orders.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.paymetStatus = "PAID";
  await order.save();

  return res.status(200).json(
    new ApiResponse(200, order, "Order marked as paid")
  );
});