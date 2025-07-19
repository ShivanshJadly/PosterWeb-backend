import { Router } from "express";
import { addToWishlist, addUserAddress, getUserAddress, getUserInfo, getWishlist, login, logoutUser, removeFromWishlist, signup } from "../controllers/user.controller.js";
import {verifyJwt} from "../middleware/auth.middleware.js"

const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").get(verifyJwt,getUserInfo);

//secure routes
router.route("/logout").post(verifyJwt ,logoutUser);
router.route("/add-address").post(verifyJwt, addUserAddress);
router.route("/get-address").get(verifyJwt, getUserAddress);

//wishList
router.route("/add-wishlist").post(verifyJwt,addToWishlist)
router.route("/get-wishlist").get(verifyJwt,getWishlist)
router.route("/remove-from-wishlist").post(verifyJwt,removeFromWishlist)

export default router;