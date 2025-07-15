import { Cart } from "../models/cart.model.js";
import { Poster } from "../models/poster.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { poster, size, quantity } = req.body;

    if (!poster || !size || !quantity) {
        throw new ApiError(400, "Poster, size, and quantity are required");
    }

    const posterExists = await Poster.findById(poster);
    if (!posterExists) {
        throw new ApiError(404, "Poster not found");
    }

    const existingCartItem = await Cart.findOne({ user: userId, poster, size });

    if (existingCartItem) {
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return res.status(200).json(new ApiResponse(200, existingCartItem, "Cart item updated"));
    }

    const newCartItem = await Cart.create({
        user: userId,
        poster,
        size,
        quantity
    });

    res.status(201).json(new ApiResponse(201, newCartItem, "Item added to cart"));
});

const getCartItems = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cartItems = await Cart.find({ user: userId }).populate("poster");

    res.status(200).json(new ApiResponse(200, cartItems, "Cart items fetched"));
});

const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { cartItemId } = req.params;
    const { quantity, size } = req.body;

    const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

    if (!cartItem) {
        throw new ApiError(404, "Cart item not found");
    }

    if (quantity !== undefined) cartItem.quantity = quantity;
    if (size) cartItem.size = size;

    await cartItem.save();

    res.status(200).json(new ApiResponse(200, cartItem, "Cart item updated"));
});

const removeCartItem = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { cartItemId } = req.params;

  const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

  if (!cartItem) {
    throw new ApiError(404, "Cart item not found");
  }

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
    await cartItem.save();
    return res.status(200).json(new ApiResponse(200, cartItem, "Reduced item quantity by 1"));
  } else {
    await Cart.deleteOne({ _id: cartItemId, user: userId });
    return res.status(200).json(new ApiResponse(200, cartItem, "Cart item removed"));
  }
});


const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Cart.deleteMany({ user: userId });

    res.status(200).json(new ApiResponse(200, null, "Cart cleared successfully"));
});

export {
    addToCart,
    getCartItems,
    updateCartItem,
    removeCartItem,
    clearCart
};
