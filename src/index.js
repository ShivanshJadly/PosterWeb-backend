import dotenv from "dotenv";
import connectDB from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
        app.get("/", (req, res) => {
            res.send("🚀 Server is up and running!");
        });
        app.listen(process.env.PORT, ()=>{
            console.log(`App listening on port ${process.env.PORT}.`)
        })
    }
)
.catch((err)=>{
    console.log("Mongo db connection failed !!!",err);
})