import mongoose, {Schema} from "mongoose";

const reviewSchema = new Schema({
	customerReview: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	comments:{
		type: String,
		trim: true
	}

},{timestamps: true}
);

export const Review = mongoose.model("Review", reviewSchema);