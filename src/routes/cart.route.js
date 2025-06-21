// cart.routes.js (example)
import {Router} from "express";
import { addToCart, getCartItems, updateCartItem, removeCartItem, clearCart } from "../controllers/cart.controller.js";
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJwt);

router.post("/", addToCart);
router.get("/", getCartItems);
router.put("/:cartItemId", updateCartItem);
router.delete("/:cartItemId", removeCartItem);
router.delete("/", clearCart);

export default router;
