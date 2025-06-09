import { model, Schema, models } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
  },
  {
    timestamps: true
  }
);

const User = models.User || model("User", messageSchema);

export default User;