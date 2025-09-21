import express from 'express'
const authRoutes = express.Router();


import { signUp , login , varifyEmail , sendVarificationOTP , passwordResetOTP , resetPassword , logout , userProfile , authenticate} from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.moddleware.js';
import validator from '../middlewares/validator.middleware.js';
import { registrationValidator , loginValidator , verifyEmailOTPValidator, resetPasswordOTPValidator } from '../validator/vaidation.js';


authRoutes.post("/signup" , registrationValidator(), validator , signUp)
authRoutes.post("/login" ,loginValidator(), validator , login)
authRoutes.get("/authenticate" , auth , authenticate)
authRoutes.get("/sendVarificationOTP", verifyEmailOTPValidator(), validator ,auth , sendVarificationOTP)
authRoutes.post("/varifyEmail" ,  varifyEmail)
authRoutes.get("/passwordResetOTP" , resetPasswordOTPValidator(), validator , auth , passwordResetOTP)
authRoutes.post("/resetPassword" ,auth ,  resetPassword)
authRoutes.get("/logout" , auth , logout);
authRoutes.get("/profile" , auth , userProfile)


export default authRoutes