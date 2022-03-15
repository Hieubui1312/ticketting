import express, {Request, Response} from "express";
import {body, validationResult} from "express-validator";
import {validateRequestError} from "common-hieubm";
import {User} from "../models/user";
import {BadRequestError} from "common-hieubm";
import jwt from "jsonwebtoken";
import {Password} from "../services/password";


const router = express.Router();

router.post("/api/users/signin", [
    body("email").isEmail().withMessage("Email must be used"),
    body("password").trim().notEmpty().isLength({min: 4, max: 20}).withMessage("Password must be between 4 and 40 character")
], validateRequestError,
    async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({
        email
    });
    if (!existingUser) {
        throw new BadRequestError("Email is not found")
    }

    const passwordValid = await Password.comparePassword(existingUser.password, password);
    if (!passwordValid) {
        throw new BadRequestError("Credential is not valid")
    }

    const userJwt = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_SECRET!);
    req.session = {
        jwt: userJwt
    }

    res.status(200).json(existingUser)
})

export { router as SignInRouter }
