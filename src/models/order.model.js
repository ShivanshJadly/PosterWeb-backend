import mongoose,{Schema} from "mongoose";


const orderItemSchema = new Schema({
    productId:{
        type: Schema.Types.ObjectId,
        ref: "Poster"
    },
    quantity: {
        type: Number,
        required: true
    },
    posterSize: {
        type: String,
        required:true
    }
})
const orderSchema = new Schema({

    customer:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems:{
        type: [orderItemSchema]
    },

    shippingAddress: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    paymetMethod: {
        type: String,
        enums: ["COD","Online"],
        default: "Online"
    },
    paymetStatus: {
        type: String,
        enums: ["PENDING","PAID"],
        default: "PENDING"
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    // When was delivered
    deliverAt:{
        type: Date
    },
    totalPrice: {
        type: Number,
    }

},{timestamps: true});

export const Orders = mongoose.model("Orders", orderSchema);