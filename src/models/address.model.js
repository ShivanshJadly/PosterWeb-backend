import mongoose, {Schema} from "mongoose";

const addressSchema = new Schema({
    addressLine1: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
},{timestamps:true});

export const Address = mongoose.model("Address",addressSchema);