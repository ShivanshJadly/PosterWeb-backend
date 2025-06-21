import mongoose, {Schema} from "mongoose";

const cartSchema = new Schema({
     user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    poster:{
        type: Schema.Types.ObjectId,
        ref: "Poster"
    },
    size:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
},{timestamps:true})

export const Cart = mongoose.model("Cart",cartSchema);