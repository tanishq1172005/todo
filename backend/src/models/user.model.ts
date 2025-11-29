import mongoose, { Document, Schema } from "mongoose";

export interface User extends Document {
    name: string,
    email: string,
    password: string,
    resetPasswordOtp: string,
    resetPasswordOtpExpiry: Date
}

const userSchema: Schema<User> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true
    }, resetPasswordOtp: {
        type: String,
        default: ''
    }, resetPasswordOtpExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)