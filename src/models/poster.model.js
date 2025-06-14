import mongoose, {Schema} from "mongoose";

const posterSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: 0
  },
  posterImage: {
    image:{
      type: String,
      required: true
    },
    public_id:{
      type: String
    }
  },
  stock: {
    type: Number,
    default: 0
  },
  category: {
    type: [Schema.Types.ObjectId],
    ref: "Category",
    required: true,
    index:true
  },
  tags:{
    type: [String]
  },
  review: {
    type: [Schema.Types.ObjectId],
    ref: "Review"
  },
  averageRating:{
    type: Number,
    default: 0
  },
  totalReview:{
    type: Number,
    default: 0
  }
},{timestamps: true});

export const Poster = mongoose.model('Poster', posterSchema);