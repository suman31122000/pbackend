import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();
app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

app.use(express.json({limit:"16kb"})); //we are configuring it for reciving data in json format
app.use(express.urlencoded({limit:"16kb",extended:true})); //we are configuring it for reciving data in urlencoded format
app.use(express.static("public"));
app.use(cookieParser());