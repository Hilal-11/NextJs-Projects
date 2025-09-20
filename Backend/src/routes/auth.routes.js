import express from 'express'
const authRoutes = express.Router();


import { signUp , login , varifyEmail , sendVarificationOTP , passwordResetOTP , resetPassword , logout , userProfile , authenticate} from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.moddleware.js';

authRoutes.post("/signup" , signUp)
authRoutes.post("/login" , login)
authRoutes.get("/authenticate" , auth , authenticate)
authRoutes.get("/sendVarificationOTP" , auth , sendVarificationOTP)
authRoutes.post("/varifyEmail" , auth ,  varifyEmail)
authRoutes.get("/passwordResetOTP" , passwordResetOTP)
authRoutes.post("/resetPassword" , resetPassword)
authRoutes.get("/logout" , auth , logout);
authRoutes.get("/profile" , auth , userProfile)




export default authRoutes