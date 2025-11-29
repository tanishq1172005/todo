import { RequestHandler } from "express"
import { User } from "../models/user.model"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import resend from "../config/resend"
import crypto from 'crypto'

const generateToken = (userId: string) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" })
}

const registerUser: RequestHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString())
        })
    } catch (err: any) {
        return res.status(500).json({ message: "Server Error", err: err.message })
    }
}

const loginUser: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid email or password" })
        }
        return res.status(200).json({
            _id:user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id.toString())
        })
    } catch (err: any) {
        return res.status(500).json({ message: "Server Error", err: err.message })
    }
}

const forgotPassword: RequestHandler = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [email],
            subject: "Password Reset OTP",
            text: `Your password reset OTP is: ${otp}. It expires in 10 minutes.`
        });

        if (error) {
            return res.status(500).json({ message: "Error sending email", error: error });
        }
        return res.status(200).json({ message: "OTP sent to email" });

    } catch (err: any) {
        return res.status(500).json({ message: "Server Error", err: err.message })
    }
}

const resetPassword: RequestHandler = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordOtpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOtp = "";
        user.resetPasswordOtpExpiry = null as any;
        await user.save();

        return res.status(200).json({ message: "Password reset successful" })
    } catch (err: any) {
        return res.status(500).json({ message: "Server Error", err: err.message })
    }
}

export { loginUser, registerUser, forgotPassword, resetPassword }