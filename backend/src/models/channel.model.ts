import { model, Schema, models } from "mongoose";

const channelSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    workspace: [{ type: Schema.Types.ObjectId, ref: "Workspace" }],
  },
  {
    timestamps: true
  }
);

const Channel = models.Channel || model("Channel", channelSchema);

export default Channel;