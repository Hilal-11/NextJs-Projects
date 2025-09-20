import express from 'express'
const app = express();
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './database/connectDB.js';
import appRouter from './routes/appRoutes.routes.js';
import authRoutes from './routes/auth.routes.js';
dotenv.config({
    path: './.env'
});
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET" , "POST", "DELETE", "PATCH" , "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(cookieParser());
app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/user' , appRouter);

app.get("/" , (req , res) => {
    res.end("<h1>Building the Google Keep Backend</h1>")
})

connectDB()
    .then(() => {
        app.listen(PORT , () => {
            console.log(`App is running on PORT: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Connection Failed, some internal server issues", error.message)
    })