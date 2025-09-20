import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
    },
    secure: false,
})

export default transporter