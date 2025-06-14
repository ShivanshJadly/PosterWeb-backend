import {Poster} from "../models/poster.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { oldImageToBeDeleted, uploadToCloudinary } from "../utils/cloudinary.js"
import {User} from "../models/user.model.js"


const addPoster =asyncHandler( async (req, res) => {
    const {
      title,
      description,
      price,
      category,
      stock,
      tags
    } = req.body

    if (
      !title ||
      !description ||
      !price ||
      !category ||
      !stock ||
      !tags
    ) {
      throw new ApiError(400,"All fields are required.")
    }

    const posterImageLocalPath = req.file?.path;
    // console.log(posterImageLocalPath);

    if( !posterImageLocalPath ){
        throw new ApiError(400, "Poster image is required.")
    }

    const posterImage = await uploadToCloudinary(posterImageLocalPath);

    if(!posterImage){
      throw new ApiError(401, "Poster image is required.")
    }

    const poster = await Poster.create({
      title,
      description,
      posterImage: {
        image:posterImage.url,
        public_id: posterImage.public_id
      },
      price,
      stock,
      category,
      tags
    })

    return res.status(200)
    .json(
      new ApiResponse(200, poster, "Poster added successfully.")
    )

})

const getPosterInfo = asyncHandler(async (req, res) => {
      const { posterId } = req.params

      const poster = await Poster.findById(posterId).populate("category")

      if(!poster){
        throw new ApiError(404,"Poster not found.")
      }
  
      return res.status(200)
      .json(
        new ApiResponse(200,poster, "Poster details fetched successfully.")
      )
})

const deletePoster = asyncHandler(async (req, res) => {

    const { posterId } = req.params

    const poster = await Poster.findById(posterId)

    if (!poster) {
      throw new ApiError(404,"Poster not found.")
    }

    await oldImageToBeDeleted(poster?.posterImage?.public_id);

    await Poster.findByIdAndDelete(posterId);


    return res.status(200)
      .json(
        new ApiResponse(200,{}, "Poster deleted successfully.")
      )
})

const getPosterByCategory = asyncHandler( async(req,res)=>{
  const {categoryId} = req.params;

  try {
    const page = req.query?.page || 1;
    const limit = req.query?.limit || 20;
    const skip = (page-1) * limit;
  
    const [ totalCount, posters] = await Promise.all([
      Poster.countDocuments({category: categoryId}),
      Poster.find({category: categoryId})
      .sort({createdAt: -1})
      .skip(skip)
      .limit(limit)
    ])
  
    const totalPages = Math.ceil(totalCount/limit);

    return res.status(200)
    .json(
      new ApiResponse(
        200,
        {
          posters,
          pagination:{
            totalItems: totalCount,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          }
        },
        "Category wise posters fetched successfully.")
    )
} catch (error) {
    throw new ApiError(400, "Something went wrong while fetching posters.")
  }
})

const getPosters = asyncHandler( async(req,res)=>{
  const page = req.query?.page || 1;
  const limit = req.query?.limit || 20;
  const skip = (page-1)*limit;

  const posters = await Poster.find({})
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }); 

  const total = await Poster.countDocuments();

  return res.status(200).json(
    new ApiResponse(
      200, 
      {
        posters,
        pagination:{
          page,
          totalPages: Math.ceil(total / limit),
          totalItems: total
        }
      },
      "Posters fetched successfully")
  );
})


// You call this on every keystroke after a debounce (e.g., 300ms).
// Returns titles & thumbnails to show in dropdown/list under search bar.
const suggestPosters = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.status(200).json(new ApiResponse(200, [], "No query provided"));
  }

  const regex = new RegExp(query, "i");

  const suggestions = await Poster.find(
    { title: regex },
    { title: 1, posterImage: 1 }
  )
    .limit(8);

  return res.status(200).json(
    new ApiResponse(200, suggestions, "Suggestions fetched")
  );
});

// searching method
const searchPosters = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  if (!query || query.trim() === "") {
    throw new ApiError(400, "Search query is required.");
  }

  const searchRegex = new RegExp(query, "i");

  const [total, posters] = await Promise.all([
    Poster.countDocuments({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ],
    }),
    Poster.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ],
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(200, {
      posters,
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    }, "Search results fetched successfully.")
  );
});


export {
  addPoster,
  getPosterInfo,
  deletePoster,
  getPosterByCategory,
  getPosters,
  suggestPosters,
  searchPosters
}


