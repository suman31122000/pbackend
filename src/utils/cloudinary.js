import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadonCloudinary=async (localFilePath)=>{
 try {
    if(!localFilePath) return null;
    //upload the file on cloudinary
    const result=await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto",
    });
    //unlick the file from the server
    fs.unlinkSync(localFilePath);
    return result
 } catch (error) {
    fs.unlinkSync(localFilePath); //removed the localy saved temporary file
 }
}

export default uploadonCloudinary;