import ApiError from "../utils/apError.js";
import {AsyncHandler} from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/apiResponse.js";

const generateAccessAndRefreshToken=async(userId)=>{
    try {
       const user= await User.findById(userId);
       const accesstoken= user.generateAccessToken();
       const refreshtoken= user.generateRefreshToken();
      user.refreshToken=refreshtoken;
     await user.save({validBeforeSave:false});
     return {accesstoken,refreshtoken};

    } catch (error) {
        console.error("Error in generateAccessAndRefreshToken:", error);
        throw new ApiError(500,"something went wrong while generating refresh and access token");
    }
}
const registerUser=AsyncHandler(async(req,res)=>{
    const {username,email,fullname,password}=req.body;
    if(
        [username,email,fullname,password].some((el)=>el?.trim()?.length===0))
    {
        throw new ApiError("All fields are required",400);
    }

    if(email.includes("@gmail.com")===false){
        throw new ApiError("Invalid email",400);
    }

    const userExists=await User.findOne({$or:[{username},{email}]});
    console.log(userExists);
    if(userExists){
        throw new ApiError("User already exists",400);
    }

    const avatarpath=req.files?.avatar[0]?.path
    const coverimagepath=req.files?.coverimage[0]?.path

    console.log(avatarpath,coverimagepath);

    if(!avatarpath){
        throw new ApiError("All fields are required",400);    
    }

    const avatar=await uploadonCloudinary(avatarpath);
    const coverimage=await uploadonCloudinary(coverimagepath);

    if(!avatar){
        throw new ApiError("Avatar upload failed",400);
    }

    const user=await User.create({
        username,email,fullname,password,avatar:avatar.url,coverimage:coverimage?.url||"",
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken");


    if(!createdUser){
        throw new ApiError("User creation failed during registration",400);
    }
    
    // fs.unlinkSync(avatarpath,(err)=>{
    //     if(err){
    //         console.log(err);
    //     }
    //     console.log("file deleted");
    // });
    // fs.unlinkSync(coverimagepath);
    return res.status(201).json(new ApiResponse(201,createdUser,"User registered successfully"));

})

const loginuser=AsyncHandler(async (req,res)=>{
    //access data from re.body
    //validate data
    //check if user exist in database not
    //check provided password is correct or not
    //send generated token via cookies
    const {email,username,password}=req.body;
    if(!email && !username){
        throw new ApiError(400,"Email or username is required");
    }
    const user=await User.findOne({$or:[{email},{username}]})
    
    if(!user){
        throw new ApiError(400,"User not found");
    }
    const isPasswordCorrect=await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){    
        throw new ApiError(400,"Password is incorrect");
    }
    const {accesstoken,refreshtoken}=await generateAccessAndRefreshToken(user._id)
   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

   const options={
    httpOnly:true,
    secure:true
   }

   return res.status(200)
   .cookie("accessToken",accesstoken,options)
   .cookie("refreshToken",refreshtoken,options)
   .json(
    new ApiResponse(200,{user:loggedInUser,accesstoken,refreshtoken},"user logged in successfully")
   )
})

//logout
//remove refresh token from database and expire access token and refreshtoken
// of we are not using response fields then we can use _
const logoutuser=AsyncHandler(async(req,res)=>{
    User.findByIdAndDelete(req.user._id,{
        $set:{refreshToken:undefined}
    },
{
    new:true
})

const options={
    httpOnly:true,
    secure:true
   }

return res.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,null,"user logged out successfully"))
})

export {registerUser,logoutuser,loginuser}