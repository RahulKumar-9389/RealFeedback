import mongoose from "mongoose";

type chekConnection = {
    isConnected?: Number;
}

const connection: chekConnection = {};

export async function connectDB(): Promise<void> {
    // chek: is database alredy connectd?
    if (connection.isConnected) {
        console.log("Database is already connected");
        return
    }

    try {
        const response = await mongoose.connect(process.env.MONGO_URI!);
        connection.isConnected = response.connections[0].readyState;
        console.log("MongoDB connected!");

    } catch (error) {
        console.log(`Mongodb connection failed due to ${error}`);
        process.exit(1);
    }
}