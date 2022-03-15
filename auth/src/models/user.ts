import mongoose from "mongoose";
import {Password} from "../services/password";


interface UserAttr {
    email: string
    password: string
}

interface UserModel extends mongoose.Model<UserDocument>{
    build(attr: UserAttr): UserDocument
}

interface UserDocument extends mongoose.Document {
    email: string
    password: string
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = doc._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    }
})
userSchema.statics.build = (attr: UserAttr) => {
    return new User(attr)
}
userSchema.pre("save", async function(done) {
    if (this.isModified("password")) {
        const hashedPassword = await Password.toHash(this.get("password"))
        this.set("password", hashedPassword)
    }
    done()
})

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);


export {User}
