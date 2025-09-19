import express from 'express'
const app = express();
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import connectDB from './database/connectDB';
import appRouter from './routes/appRoutes.routes';
import authRoutes from './routes/auth.routes';
dotenv.config();
const PORT = process.env.PORT

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "",
    methods: ["GET" , "POST", "DELETE", "PATCH" , "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}))
app.use(cookieParser());
app.use('/api/v1/auth' , authRoutes);
app.use('/api/v1/user' , appRouter);


connectDB()
    .then(() => {
        app.listen(PORT , () => {
        console.log(`App is running on PORT: ${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Connection Failed, some internal server issues", error.message)
    })