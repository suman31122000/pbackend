import mongoose,{Schema} from "mongooose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
videofile:{
    type:String, //cloudinary url
    require:true,
},
thumbnail:{
    type:String,//cloudinary url
    required:true,
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
title:{
    type:String,
    required:true,
    lowercase:true,
},
description:{
    type:String,
    required:true,
},
duration:{
    type:Number, //by cloudinary
    requied:true,
},
views:{
    type:Number,
    default:0,
},
ispublished:{
    type:Boolean,
    default:true,
},
},{Timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate);
export const video=mongoose.model("video",videoSchema);