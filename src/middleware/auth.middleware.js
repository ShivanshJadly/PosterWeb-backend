// Importing required modules
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJwt = asyncHandler( async (req, _ , next) => {
   const token = req.cookies?.accessToken ||
                 req.body?.accessToken ||
                 req.header("Authorization").replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "Unauthorized request.")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if(!user){
            throw new ApiError(401, "Invalid token.")
        }

        req.user = user;
        next();

    } catch (err) {
        throw new ApiError(401, err?.message || "Invalid access token.")
    }
});

export const isAdmin = asyncHandler( async (req, res, next) => {
	try {
        const email = req.user.email
		const user = await User.findOne({email});

        if(!user){
            throw new ApiError(404, "User not found.")
        }

		if (user.accountType !== "ADMIN") {
			throw new ApiError(401, "Can't access admin endpoints.")
		}
		next();
	} catch (error) {
		throw new ApiError(401, error?.message ||"Can't access admin endpoints.")
	}
});

