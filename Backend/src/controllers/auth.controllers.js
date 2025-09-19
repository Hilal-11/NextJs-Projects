import User from "../models/User.model";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
import transporter from "../utils/nodeMailer";
import bcrypt from "bcryptjs";

const signUp = async (req , res) => {
    const { username , email , password } = req.body;
    if(!username || ! email || !password) {
        return res.status(400).json({
            success: false,
            message: "incorrect user cradentials",
        })
    }
    try{
        const userExists = await User.findOne({email})
        if(userExists) {
            return res.status(401).json({
                success: false,
                message: "User already register or exists"
            }) 
        }
        const user = await User.create({
            username,
            email,
            password
        })
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "Failed to register user"
            })
        }
        // generate JWT token
        const token = jwt.sign({ 
            id: user._id, 
            user: user.email, 
            name: user.username
        },process.env.SECRET_KEY, { expiresIn: "24h"})

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }
        // set JWT Token in cookies
        res.cookie("token", token , options);
        
        // send welcome mail on Gmail 
        const mailOptions = {
            from: process.env.SENDER_MAIL,
            to: user.email,
            subject: `Hi ${user.username} welcome in Keep.com`,
            text: "Welcome to Keep",
            html: `Hi ${user.username} welcome in Keep.com`
        }
        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log("Mail send successfully", info)
            })
            .catch((error) => {
                console.log("Failed to send the mail ",error.message)
            })
        // save user on DB

          return res.json({
            success: true,
            message: "Successful regestration"
        })


    }catch(error) {
        console.log(error.message)
        res.status(400).json({
            success:false,
            message: "failed to register user, internal server error",
            error: error.message
        })
    }
}

const login = async () => {
    const { email , password } = req.body;
    if(!email || !password) {
        return res.status(400).json({
            success: false,
            message: "invalid user cradentials",
        })
    }
    try{
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "user is not exists in DB please register first"
            })
        }
        const isMatchPassword = await bcrypt.compare(password , user.password)
        if(!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "email and password are incorrect"
            })
        }

        // Create JWT Token
        const token = await jwt.sign({
            id: user._id,
            user: user.email
        }, process.env.SECRET_KEY , { expiresIn: "24h"})

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        }
        res.cookie("cookie" , token, {options})

        res.status(200).json({
            success: true,
            message: "login successfully"
        })
    }catch(error) {
        console.log(error.message)
        return res.status().json({
            success: false,
            message: "Failed to login"
        })
    }
}

const sendVarificationOTP = async () => {
    try{

    }catch(error) {
        
    }
}
const varifyEmail = async () => {
    try{

    }catch(error) {
        
    }
}
const logout = async (req , res) => {
    try{
        res.clearCookie("cookie" , {
             httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none': 'strict',
            maxAge: Date.now() + 24 * 60 * 60 * 1000 
        })

        res.status(200).json({
            success: true,
            message: "Logout successfully"
        })
    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "Failed to logout"
        })
    }
}

const forgetPassword = async () => {
    try{

    }catch(error) {
        
    }
}

const resetPassword = async () => {
    try{

    }catch(error) {
        
    }
}

const userProfile = async () => {
    try{

    }catch(error) {
        
    }
}

export { signUp , login , varifyEmail , logout, forgetPassword , resetPassword , userProfile }