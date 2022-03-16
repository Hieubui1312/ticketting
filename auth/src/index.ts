import mongoose from "mongoose";
import {app} from "./app";

const start = async () => {
    console.log("Starting ... ")
    if (!process.env.JWT_SECRET) {
        throw Error("Not found jwt secret key")
    }
    if (!process.env.MONGO_URI) {
        throw Error("Not found mongo uri")
    }

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("CONNECT DB SUCCESS")
    } catch (error) {
        console.log("ERROR CONNECT DB", error)
    }
    app.listen(3000, () => {
        console.log("Auth server is listening into port 3000 !!")
    })
}

start()
