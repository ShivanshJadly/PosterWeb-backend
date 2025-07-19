import { Router } from "express";
import { addReview, getPosterReviews } from "../controllers/review.controller.js";
import {verifyJwt, isAdmin} from "../middleware/auth.middleware.js"
const router = Router();

router.route("/add-review").post(verifyJwt,addReview)
router.route("/get-poster-review/:posterId").get(verifyJwt,isAdmin,getPosterReviews)

export default router;