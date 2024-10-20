// contains the logic to connect to MongoDB using Mongoose, centralizing all database connection logic in one place.
import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`err:${err.message}`);
        process.exit(1); //process code 1 means exit with  failure, 0 means success
    }
};
