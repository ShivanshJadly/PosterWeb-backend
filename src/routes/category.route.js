import { Router } from "express";
import { verifyJwt,isAdmin } from "../middleware/auth.middleware.js";
import { addCategory, getCategory } from "../controllers/category.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route("/add-category").post(verifyJwt, 
    isAdmin, 
    upload.single("coverImage"),
    addCategory
);

router.route("/get-category").get(getCategory);

export default router;