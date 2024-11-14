import ApiError from "../utils/apError.js";
import {AsyncHandler} from "../utils/asyncHandler.js";
import user from "../models/user.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";
const registerUser=AsyncHandler(async(req,res)=>{
    const {username,email}=req.body;
    console.log(username,email,fullname,password);
    
    if(
        [username,email,fullname,password].some((el)=>el?.trim()?.length===0))
    {
        throw new ApiError("All fields are required",400);
    }

    if(email.includes("@gmail.com")===false){
        throw new ApiError(400,"Invalid email");
    }

    const userExists=await user.findOne({$or:[{username},{email}]});
    if(userExists){
        throw new ApiError(400,"User already exists");
    }

    const avatarpath=req.files?.avatar[0]?.path
    const coverimage=req.files?.coverImage[0]?.path

    if(!avatarpath){
        throw new ApiError(400,"All fields are required");    
    }

    const avatar=await uploadonCloudinary(avatarpath);
    const coverimagepath=await uploadonCloudinary(coverimagepath);

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed");
    }

    const user=await user.create({
        username,email,fullname,password,avatar:avatar.url,coverimage:coverimage?.url||"",
    })
    const createduser=await user.findbyId(user._id).select("-password -refreshToken");

    if(!createduser){
        throw new ApiError(400,"User creation failed during registration");
    }

    return res.status(201).json(new ApiResponse(201,createduser,"User registered successfully"));

})

export {registerUser}