import mongoose,{Schema} from "mongoose";

// Define the Tags schema
const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String 
	},
	coverImage:{
		type: String
	},
	priority:{
		type: Number
	},
	// URL-friendly version of naming (e.g => Star Wars --> star-wars)
	slug:{
		type: String,
		required: true
	}
}, {timestamps: true});

// Export the Tags model
export const Category = mongoose.model("Category", categorySchema);