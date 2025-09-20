import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI)
        console.log("Database connection is done")
    }catch(error) {
        console.log("Database connection failed")
        process.exit(1);
    }
}

export default connectDB;