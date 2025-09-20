import User from "../models/User.model.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
import transporter from "../utils/nodeMailer.js";


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
            id: user.id, 
            user: user.email, 
            name: user.username
        },process.env.SECRET_KEY, { expiresIn: "24h"})

        const options = {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }
        // set JWT Token in cookies
        res.cookie("token", token , options);
        
        // send welcome mail on Gmail 
        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL,
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

          return res.status(200).json({
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

const login = async (req , res) => {
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
        const isMatchPassword = await user.isPasswordCorrect(password);
        if(!isMatchPassword) {
            return res.status(401).json({
                success: false,
                message: "email and password are incorrect"
            })
        }

        // Create JWT Token
        const token = await jwt.sign({
            id: user._id,
            name: user.username,
            email: user.email,
        }, process.env.SECRET_KEY , { expiresIn: "24h"})

        const options = {
            httpOnly: true,
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

const authenticate = async (req , res) => {
    const id  = req.user.id
    console.log("my_id = ", id)
    try{
        const user = await User.findById(id)
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "user not found, failed to authenticate"
            })
        }
        console.log("response = " ,user)
        res.status(200).json({
            success: true,
            response: user,
            message: "user profile"
        })
    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "User is not authenticated"
        })
    }
}

const sendVarificationOTP = async (req , res) => {
    const id = req.user.id;
    console.log(id)
    if(!id) {
        return res.status(400).json({
            success: false
        })
    }
    try{
        const user = await User.findById(id);
        if(user.isVarified){
            return res.status(400).json({
                success: false,
                message: "User already varified"
            })
        }

        // Generate 6-Digit OTP
        const OTP = String(Math.floor(100000 + Math.random() * 900000));
        user.varifyOtp = OTP
        user.varifyOtpExpireAt = Date.now() + 15 * 60  * 1000 //15 minutes
        
        
        await user.save()

        // Send OTP on Emial
        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: `User varification OTP,  use thia OTP ${OTP} to varify your account`,
            text: "Welcome to Keep",
            html: `Hi ${user.username} welcome in Keep.com`

        }
        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log("Otp is sent successfully", info)
            }).catch((error) => {
                console.log("Failed to sent OPT \n", error.message)
            })

        // return success respons
        res.status(200).json({
            success: true,
            message: "Varifivartion OTP sent successfully",
        })

    }catch(error) {
        console.log(error.message)
        return res.status(400).json({
            success: false,
            message: "Failed to varify account"
        })
    }
}

const varifyEmail = async (req , res) => {
    const { id , OTP } = req.body;
    if(!id || !OTP) {
        return res.status(400).json({
            success: false,
            message: "Incorrect user and OTP"
        })
    }
    try{    
        const user = await User.findById({_id: id})
        if(!user){
            return res.status(400).json({
                success: false,
                message: "user is not exists "
            })
        }
        //  VARIFY THE OTP
        if(user.varifyOtp == '' || user.varifyOtp != OTP) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }

        if(user.varifyOtpExpireAt < Date.now()) {
            return res.status(401).json({
                success: false,
                message: "OTP Expired"
            })
        }

        user.isVarified = true;
        user.varifyOtp = '',
        user.varifyOtpExpireAt = 0

        await user.save()

        return res.status(200).json({ success: true , message: "Email Varified Successfully"})

    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "Email varification failed",
            error: error.message
        })
    }
}

const logout = async (req , res) => {
    try{
        res.cookie("token" , "" , {})
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

const passwordResetOTP = async (req , res) => {
    const id = req.user.id
    if(!id) {
        return res.status(400).json({
            success: false,
            message: "user not found while trying to forgetting password"
        })
    }
    try{
        const user = await User.findById({_id: id})
        if(!user) {
            res.status(400).json({
                success: true,
                message: "Failed to forget password"
            })
        }

        // Generate OTP
        const OTP = String(Math.floor(100000 + Math.random() * 900000));

        const mailOptions = {
            from: process.env.MAILTRAP_SENDEREMAIL,
            to: user.email,
            subject: `Reset password OTP,  use this OTP ${OTP} to Reset your password`,
            text: "Welcome to Keep",
            html: `Hi ${user.username} welcome in Keep.com`
        }
        transporter.sendMail(mailOptions)
            .then((info) => {
                console.log("Reset password OTP sent done ", info)
            })
            .catch((error) => {
                console.log("Failed to send reset OTP",error.message);
            })

        user.resetPasswordOTP = OTP;
        user.resetPasswordOTPExpiry = Date.now() + 15 * 60 * 1000;
        await user.save()

        res.status(200).json({
            success: true,
            message: "forget password OTP sent"
        })

    }catch(error) {
         return res.status(401).json({
            success: false,
            message: "Failed to send reset password otp"
        })
    }
}


const resetPassword = async (req , res) => {
    const id = req.user.id
    const { email , OTP ,  newPassword } = req.body;
    console.log(email , OTP , newPassword)
    if(!email || !OTP || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "invalid cradentials"
         })
    }
    try{

        const user = await User.findOne({_id: id})
        
        console.log(user)
        if(!user) {
            res.status(401).json({
            success: false,
            message: "user not exists, incorrect email"
         })
        }

        if(user.resetPasswordOTP == '' || user.resetPasswordOTP != OTP) {
            res.status(400).json({
                success: false,
                message: "Invalid reset password OTP"
            })
        }
        if(user.resetPasswordOTPExpiry < Date.now()){
            res.status(400).json({
                success: false,
                message: "Reset Password OTP has been expired"
            })
        }

        user.password = newPassword;
        user.resetPasswordOTP = '';
        user.resetPasswordOTPExpiry = 0

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })
        
        
    }catch(error) {
         return res.status(401).json({
            success: false,
            message: "Can't reset password"
        })
    }
}

const userProfile = async (req , res) => {
    const id = req.user.id
    if(!id) {
       return res.status(400).json({
            success: false,
            message: "invalid user"
        }) 
    }
    try{
        const user = await User.findById(id.toString()).select('-password')
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            }) 
        }

        res.status(200).json({
            success: true,
            response: user,
            message: "User Profile found"
        })
    }catch(error) {
        return res.status(401).json({
            success: false,
            message: "Can't found user"
        })
    }
}

export { signUp , login , authenticate ,sendVarificationOTP , varifyEmail , logout, passwordResetOTP , resetPassword , userProfile }