import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      dbName: "teem-db",
    });
  } catch (error) {
    console.log(error);
  }
};
