import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Address } from "../models/address.model.js";
import { Poster } from "../models/poster.model.js";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findOne(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens.")
    }
}

const signup = asyncHandler(async (req, res) => {
    const { fullName, email, password, accountType } = req.body;

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All * fields are required.");
    }

    const existedUser = await User.findOne({ email });

    if (existedUser) {
        throw new ApiError(400, "User already exists.");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        accountType
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(400, "Something went wrong while creating the user.");
    }

    return res.status(200)
        .json(
            new ApiResponse(200, createdUser, "Successfully created user.")
        );

})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password is required.")
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exists.")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully.")
        )

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully.")
        );
})

const addUserAddress = asyncHandler(async (req, res) => {
    const { addressLine1, city, state, pincode, phoneNumber, isDefault } = req.body;

    if ([addressLine1, city, state, pincode].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    if (!phoneNumber) {
        throw new ApiError(400, "Phone number is required.");
    }

    const user = await User.findById(req.user);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }


    // isDefault agar true hai that means, baki address (if exists) ka default false kerna hoga
    if (isDefault) {
        await Address.updateMany(
            { 
                _id: { 
                    $in: user.address 
                }, 
                isDefault: true 
            },
            { 
                $set: { 
                    isDefault: false 
                } 
            }
        );
    }

    const newAddress = await Address.create({
        addressLine1,
        city,
        state,
        pincode,
        phoneNumber,
        isDefault
    })

    if (!newAddress) {
        throw new ApiError(500, "Something went wrong while adding address.");
    }

    user.address.push(newAddress._id);
    await user.save({ validateBeforeSave: false });

    return res.status(200)
        .json(
            new ApiResponse(200, user.address, "Address added successfully.")
        )

})

const getUserAddress = asyncHandler( async(req,res) =>{
    const address = await User.findById(req.user._id).populate("address");

    if(!address){
        throw new ApiError(404,"User not found.")
    }

    return res.status(200)
    .json(
        new ApiResponse(200, address, "User addresses fetched Successfully")
    )
})

// wishlist
const addToWishlist = asyncHandler(async (req, res) => {
  const { posterId } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const posterExists = await Poster.findById(posterId);
  if (!posterExists) {
    throw new ApiError(404, "Poster not found");
  }

  if (user?.wishList.includes(posterId)) {
    throw new ApiError(400, "Poster already in wishlist");
  }

  user?.wishList.push(posterId);
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, user?.wishList, "Poster added to wishlist")
  );
});

const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).populate("wishList");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(
    new ApiResponse(200, user?.wishList, "Wishlist fetched successfully")
  );
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const { posterId } = req.body;

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.wishList = user?.wishList.filter(
    (id) => id.toString() !== posterId
  );
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, user?.wishList, "Poster removed from wishlist")
  );
});

export {
    signup,
    login,
    logoutUser,
    addUserAddress,
    getUserAddress,
    addToWishlist,
    getWishlist,
    removeFromWishlist
}