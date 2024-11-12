import mongoose from "mongoose";
import DB_NAME from "../constant.js";

const connectDB=async()=>{
    try{
        const connectioninstance=await mongoose.connect(`${process.env.MONGODB_URl}`);
        console.log(`Database connected to ${connectioninstance.connection.host}`);
        process.exit(0);
    }
    catch(error){
        console.log("error: database connection error",error);
        process.exit(1);
    }
}
export default connectDB;