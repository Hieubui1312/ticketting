import express from "express";
import "express-async-errors";
import {json} from "body-parser";
import {CurrentRouter} from "./routes/current-user";
import {SignInRouter} from "./routes/signin";
import {SignOutRouter} from "./routes/signout";
import {SignUpRouter} from "./routes/signup";
import {errorHandler} from "common-hieubm";
import {NotfoundError} from "common-hieubm";
import cookieSession from "cookie-session";

const app = express();
app.set("trust proxy", true);
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test"
    })
)
app.use(CurrentRouter)
app.use(SignUpRouter)
app.use(SignInRouter)
app.use(SignOutRouter)

app.all("*", async () => {
    throw new NotfoundError();
})

app.use(errorHandler)

export {app};
