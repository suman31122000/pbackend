import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    watchgistory:{
        type: [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"video",
            }
        ]
    },
    username: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },
    email: {
        type: String,
        required: true,
        unique:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String, //cloudinary url
        required:true,
    },
    coverimage:{
        type:String,   //cloudinary url
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})


userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=await bcrypt.hash(this.password,10,);
    next();   
})

userSchema.methods.isPasswordCorrect=async function (password) {
  return await bcrypt.compare(password,this.password)
    
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign({
        _id:this.id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
    },
process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY || '1h'})
}
userSchema.methods.generateRefreshToken=function(){
   return jwt.sign({
        _id:this.id,
    },
process.env.ACCESS_TOKEN_REFRESH,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
const User = mongoose.model('User', userSchema);

export default User;