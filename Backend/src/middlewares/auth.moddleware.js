import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const auth = async(req , res , next ) => {
    try{
        const { token } = req.cookies?.token
        if(!token) {
            return res.status(400).json({
                success: false,
                message: "Authentication failed"
            })
        }
        // get the data from token
        try{
            const payload = jwt.verify(token , process.env.SECRET_KEY)
            console.log("Decoded token = ", payload)
            req.user = payload

        next()

        }catch(error) {
            return res.status().json({
                success: false,
                message: "Failed authentication , token is invalid"
            })
        }

    }catch(error) {
        return res.status(400).json({
            success: false,
            message: "failed aythentication"
        })
    }
}

export default auth




// const decodeToken = jwt.verify(token , process.env.SECRET_KEY)
//         if(decodeToken.id) {
//             req.body.id = decodeToken.id.toString()
//         }else{
//             return res.json({ success: false, message : "Not Autherized Login Again"})
//         }
        
//         next();


//  const decoded = jwt.verify(token , process.env.SECRET_KEY);
//                 console.log("Decoded token = ", decoded)
//                 req.user = decoded
        
//                 next();