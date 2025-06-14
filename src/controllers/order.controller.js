import { Orders } from "../models/order.model.js";
import { Poster } from "../models/poster.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymetMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "No order items provided");
  }

  let totalPrice = 0;

  for (let item of orderItems) {
    const product = await Poster.findById(item.productId);
    if (!product) throw new ApiError(404, `Poster not found: ${item.productId}`);
    totalPrice += product.price * item.quantity;
  }

  const newOrder = await Orders.create({
    customer: req.user._id,
    orderItems,
    shippingAddress,
    paymetMethod,
    totalPrice
  });

  return res.status(201).json(
    new ApiResponse(201, newOrder, "Order placed successfully")
  );
});

// Get All Orders (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Orders.find()
    .populate("customer", "fullName email")
    .populate("orderItems.productId", "title price");

  return res.status(200).json(
    new ApiResponse(200, orders, "All orders fetched")
  );
});

// Get Orders for Logged-in User
export const getMyOrders = asyncHandler(async (req, res) => {
  const myOrders = await Orders.find({ customer: req.user._id })
    .populate("orderItems.productId", "title price");

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