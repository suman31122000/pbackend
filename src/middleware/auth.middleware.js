import {AsyncHandler} from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/apError.js";

export const verifyJWT=AsyncHandler(async(req,res,next)=>{
try {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Beares ","")
    if(!token){
        throw new ApiError(401,"Unauthorized request")
    }
      const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
    const user=  await User.findById(decodedtoken?._id).select("-password -refreshToken")
      
    if(!user){
        throw new ApiError(401,"Invalid access token")
    }
    
    req.user=user;
    next();
} catch (error) {
    throw new ApiError(401,error?.message ||"invalid access token")
}
})
