import mongoose from "mongoose";
import DB_NAME from "../constant.js";

const connectDB=async()=>{
    try{
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URl}`);
        console.log(`Database connected to ${connectioninstance.connection.host}`);
    }
    catch(error){
        console.log("error: database connection error",error);
    }
}
export default connectDB;