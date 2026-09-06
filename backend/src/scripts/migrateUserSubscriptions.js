import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modules/users/user.model.js";

dotenv.config();

const migrateUserSubscriptions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB.");

    // Add Free plan only where a plan does not already exist.
    const planResult = await User.updateMany(
      {
        "subscription.plan": {
          $exists: false,
        },
      },
      {
        $set: {
          "subscription.plan": "free",
        },
      }
    );

    console.log(
      `Added subscription.plan to ${planResult.modifiedCount} users.`
    );

    // Add active status only where a status does not already exist.
    const statusResult = await User.updateMany(
      {
        "subscription.status": {
          $exists: false,
        },
      },
      {
        $set: {
          "subscription.status": "active",
        },
      }
    );

    console.log(
      `Added subscription.status to ${statusResult.modifiedCount} users.`
    );

    console.log("User subscription migration completed.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

migrateUserSubscriptions();
