import express from 'express'
const app = express();
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config();
const PORT = process.env.PORT


app.use(express.json());
app.use(cookieParser());
app.use('/api/v1' , __);

app.listen(PORT , () => {
    console.log(`App is running on PORT: ${PORT}`)
})