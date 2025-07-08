import mongoose, {Schema, Document} from "mongoose";

export interface User extends Document{
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    role: [string];
    activeRole: string;
    createdAt: Date;
}   

const UserSchema: Schema<User> = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/.+\@.+\..+/, "please use a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
    },
    verifyCodeExpiry: {
        type: Date,
    },
    role: {
        type: [String],
        enum: ["CUSTOMER", "PROFESSIONAL"]
    },
    activeRole: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;