import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bycrypt from "bcrypt";

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
const User = mongoose.model('User', userSchema);

userSchema.pre("save",async function (next) {
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10,);
    next();   
})

userSchema.methods.isPasswordCorrect=async function (password) {
  return await bcrypt.compare(password,this.password)
    
}
userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this.id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
    },
process.env.ACCESS_TOKEN_SECRET,{expiresIn:ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken=function(){
    jwt.sign({
        _id:this.id,
    },
process.env.ACCESS_TOKEN_REFRESH,{expiresIn:REFRESH_TOKEN_EXPIRY})
}

export default User;