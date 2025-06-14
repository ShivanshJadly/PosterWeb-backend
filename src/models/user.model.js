import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema({

  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required!"]
  },
  address: {
    type: [Schema.Types.ObjectId],
    ref: "Address"
  },
  accountType: {
    type: String,
    enums: ["ADMIN", "CUSTOMER"],
    default: "CUSTOMER"
  },
  wishList: {
    type: [Schema.Types.ObjectId],
    ref: "Poster"
  },
  orders: {
    type: [Schema.Types.ObjectId],
    ref: "Order"
  },
  refreshToken: {
    type: String
  }

}, { timestamps: true })

userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
})

// Password check method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}

//Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

  )
};

//Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }

  )
};

export const User = mongoose.model("User", userSchema);


