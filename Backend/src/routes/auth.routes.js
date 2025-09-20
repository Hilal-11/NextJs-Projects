import express, { response } from 'express'
const authRoutes = express.Router();


import { signUp , login , varifyEmail , sendVarificationOTP , passwordResetOTP , resetPassword , logout , userProfile , isAuthenticate} from '../controllers/auth.controllers';


authRoutes.post("/signup" , signUp)
authRoutes.post("/login" , login)
authRoutes.get("/authenticate" , isAuthenticate)
authRoutes.get("/sendVarificationOTP" , sendVarificationOTP)
authRoutes.post("/varifyEmail" , varifyEmail)
authRoutes.get("/passwordResetOTP" , passwordResetOTP)
authRoutes.post("/resetPassword" , resetPassword)
authRoutes.get("/logout" , logout);
authRoutes.get("/profile" , userProfile)




export default authRoutes