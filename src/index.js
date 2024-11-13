import dotenv from "dotenv";
import connectDB from "./database/index.js";
import app from "./app.js";
dotenv.config({
    path:'./.env'
});

connectDB()
.then(() => {
    console.log("database connected");
    app.listen(process.env.PORT,()=>console.log(`server is running on ${process.env.PORT}`))
})
.catch((error) => console.log(error));