import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`\n MongoDB connected ! ! DB HOST: ${connectionInstance.connection.host}`)
        // console.log(connectionInstance)
    } catch (error) {
        console.log("DB connection failed : ",error);
         process.exit(1);
    }
}

export default connectDb;