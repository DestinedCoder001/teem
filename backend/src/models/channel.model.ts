import { model, Schema, models } from "mongoose";

const channelSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  },
  {
    timestamps: true
  }
);

const User = models.User || model("User", channelSchema);

export default User;