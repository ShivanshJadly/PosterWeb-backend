import {v2 as cloudinary} from "cloudinary"
import { CLOUDINARY_FOLDER } from "../constant.js";
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: CLOUDINARY_FOLDER
        });
    
        fs.unlinkSync(localFilePath);
    
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const oldImageToBeDeleted = async (public_id) =>{

    try {
        const deleteResponse = await cloudinary.uploader.destroy(public_id)
    
        return deleteResponse;
    } catch (error) {
        console.log("Error: ",error);
    }

}

export {uploadToCloudinary, oldImageToBeDeleted};