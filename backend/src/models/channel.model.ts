import { model, Schema, models } from "mongoose";

const channelSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    members: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
  },
  {
    timestamps: true
  }
);

const Channel = models.Channel || model("Channel", channelSchema);

export default Channel;