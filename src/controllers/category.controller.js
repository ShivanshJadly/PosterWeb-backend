import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js"

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max)
// }

const addCategory =asyncHandler( async (req, res) => {
    const {
      name,
      description,
      priority,
      slug,
    } = req.body

    if ( !name || !description || !priority || !slug) {
      throw new ApiError(400,"All fields are required.")
    }

    const coverImageLocalPath = req.file?.path;

    if( !coverImageLocalPath ){
        throw new ApiError(400, "Cover image is required.")
    }

    const coverImage = await uploadToCloudinary(coverImageLocalPath);
    console.log("coverImage: ",coverImage);

    if(!coverImage){
      throw new ApiError(401, "Cover image is required.")
    }

    const category = await Category.create({
      name,
      description,
      coverImage: coverImage.url,
      slug,
      priority
    })

    return res.status(200)
    .json(
      new ApiResponse(200, category, "Category added successfully.")
    )
})

const getCategory = asyncHandler(async (req, res) => {
  const allCategory = await Category.find();

  return res.status(200)
  .json(
    new ApiResponse(200,allCategory,"All category fetched successfully.")
  )
})

// exports.categoryPageDetails = async (req, res) => {
//   try {
//     const { categoryId } = req.body

//     // Get courses for the specified category
//     const selectedCategory = await Category.findById(categoryId)
//       .populate({
//         path: "poster",
//         populate: "rating",
//       })
//       .exec()

//     // console.log("SELECTED COURSE", selectedCategory)
//     // Handle the case when the category is not found
//     if (!selectedCategory) {
//       console.log("Category not found.")
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" })
//     }
//     // Handle the case when there are no posters
//     if (selectedCategory.poster.length === 0) {
//       console.log("No postres found for the selected category.")
//       return res.status(404).json({
//         success: false,
//         message: "No posters found for the selected category.",
//       })
//     }

//     // Get posters for other categories
//     // const categoriesExceptSelected = await Category.find({
//     //   _id: { $ne: categoryId },
//     // })
//     // let differentCategory = await Category.findOne(
//     //   categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
//     //     ._id
//     // )
//     //   .populate({
//     //     path: "poster",
//     //   })
//     //   .exec()
//     // console.log()
//     // Get top-selling courses across all categories
//     // const allCategories = await Category.find()
//     //   .populate({
//     //     path: "poster",
//     //   })
//     //   .exec()
//     // const allCourses = allCategories.flatMap((category) => category.poster)
//     // const mostSellingPoster = allCourses
//     //   .sort((a, b) => b.sold - a.sold)
//     //   .slice(0, 10)

//     res.status(200).json({
//       success: true,
//       data: {
//         selectedCategory,
//       },
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }

export {
  addCategory,
  getCategory
};
