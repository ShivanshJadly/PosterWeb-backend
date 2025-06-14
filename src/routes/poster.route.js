import { Router } from "express";
import { isAdmin, verifyJwt } from "../middleware/auth.middleware.js";
import { addPoster, deletePoster, getPosterByCategory, getPosterInfo, getPosters, searchPosters, suggestPosters } from "../controllers/poster.controller.js";
import { upload } from "../middleware/multer.middleware.js"

const router = Router();

router.route("/add-poster").post(
    verifyJwt,
    isAdmin,
    upload.single("posterImage"),
    addPoster
);

router.route("/get-poster-info/:posterId").get(getPosterInfo);
router.route("/delete-poster/:posterId").delete(verifyJwt,isAdmin,deletePoster);
router.route("/get-category-wise-poster/:categoryId").get(getPosterByCategory);
router.route("/get-posters").get(getPosters);

// search routes
router.route("/live-search-suggestions").get(suggestPosters);
router.route("/search-posters").get(searchPosters);


export default router;
