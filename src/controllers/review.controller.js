import {asyncHandler} from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";
import { Poster } from "../models/poster.model.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import { Orders } from "../models/order.model.js";

const addReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { rating, comments, posterId } = req.body;  

  if (!rating || !posterId) {
    throw new ApiError(400, "Rating and posterId are required");
  }

  // Check if user purchased this poster
  const hasPurchased = await Orders.findOne({
    customer: userId,
    "orderItems.productId": posterId,
  });

  if (!hasPurchased) {
    throw new ApiError(403, "You can only review posters you have purchased.");
  }

  const alreadyReviewed = await Review.findOne({
    customerReview: userId,
    poster: posterId,
  });

  if (alreadyReviewed) {
    throw new ApiError(400, "You have already reviewed this poster.");
  }

  const review = await Review.create({
    customerReview: userId,
    rating,
    comments,
    poster: posterId,
  });

  const poster = await Poster.findById(posterId);
  if (!poster) throw new ApiError(404, "Poster not found");

  poster.review.push(review._id);
  poster.totalReview += 1;

  const allReviews = await Review.find({
     _id: { 
        $in: poster.review 
        } 
    });
  const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;

  poster.averageRating = avgRating;
  await poster.save();

  return res.status(201)
  .json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

const getPosterReviews = asyncHandler(async (req, res) => {
  const { posterId } = req.params;

  const reviews = await Review.find({ poster: posterId }).
  populate("customerReview", "fullName email");
  return res.status(200)
  .json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

export {
    addReview,
    getPosterReviews
}