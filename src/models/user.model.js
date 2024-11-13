import mongoose from "mongoose";

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

export default User;