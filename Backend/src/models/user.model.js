import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const UserSchema = new mongoose.Schema({
    id:{ type: String, },
    username: { type: String, required: true, trim: true, lowercase: true},
    // avatar: { type: {
    //     url: String,
    //     localpath: String
    // },default: { url: "https://placehold.co/600x400", localpath: ""}},
    email: { type: String, required: true, trim: true, lowercase: true, },
    password: { type: String , required: true, trim: true,},
    varifyOtp: { type: String, default: ""},
    varifyOtpExpireAt: { type: String , default: 0},
    isVarified: { type: Boolean, default: false },
    resetPasswordOTP: { type: String},
    resetPasswordOTPExpiry: { type: Date},

},{ timestamps: true})

UserSchema.pre("save" , async function (next) {
    if(this.isModified('password')) {
        const salt_round = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password , salt_round);
    }
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password , this.password)
}

export default mongoose.model("User" , UserSchema)