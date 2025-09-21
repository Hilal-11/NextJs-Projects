import mongoose from 'mongoose'

let isConnected = false // track the connection status

const connectDB = async () => {
    if(isConnected) {
        console.log("Database already connected");
        return;
    }
    try{
        await mongoose.connect(process.env.DATABASE_URI, {
            autoIndex: false, // Disable auto-creation of indexes in production
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000 // Close sockets after 45s of inactivity
        })
        isConnected = mongoose.connection.readyState === 1
        console.log(`Database connection ${mongoose.connection.host}`)

          // Graceful shutdown
        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            console.log("🔌 MongoDB connection closed due to app termination");
            process.exit(0);
        });

    
    }catch(error) {
        console.log("Database connection failed", error.message)
        process.exit(1); // Exit process if DB fails
    }
};

export default connectDB;