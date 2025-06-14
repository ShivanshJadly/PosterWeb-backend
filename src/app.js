import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));

app.use(cookieParser());

// Router imports
import userRoute from "./routes/user.route.js";
import posterRoute from "./routes/poster.route.js"
import categoryRoute from "./routes/category.route.js"
import orderRoute from "./routes/order.route.js"

// route declaration:

//user
app.use("/api/v1/users",userRoute);

//poster
app.use("/api/v1/posters",posterRoute);

//category
app.use("/api/v1/category",categoryRoute);

//order
app.use("/api/v1/orders",orderRoute)


export {app};