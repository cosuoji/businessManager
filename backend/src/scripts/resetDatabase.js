import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const resetDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to MongoDB");

        const collections = await mongoose.connection.db.collections();

        for (const collection of collections) {
            await collection.deleteMany({});
            console.log(`Cleared: ${collection.collectionName}`);
        }

        console.log("✅ Database reset complete.");
    } catch (error) {
        console.error("❌ Database reset failed:", error);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

resetDatabase();
