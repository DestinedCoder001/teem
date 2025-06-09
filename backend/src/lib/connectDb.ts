import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
      console.log("Already connected");
    }

    if (connectionState === 2) {
      console.log("Connecting...");
    }
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "teem-db",
    });
  } catch (error) {
    console.log(error);
  }
};
