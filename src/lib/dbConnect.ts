import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        console.log(db.connections);
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);

        process.exit(1)
    }


}


export default dbConnect;