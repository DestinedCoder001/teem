import { model, Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    authProvider: { type: String, default: "local" },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true
  }
);

const User = models.User || model("User", userSchema);

export default User;
