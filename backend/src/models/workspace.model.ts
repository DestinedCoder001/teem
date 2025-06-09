import { model, Schema, models } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    users: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    channels: {type: [Schema.Types.ObjectId], ref: "Channel", default: []},
  },
  {
    timestamps: true
  }
);

const Workspace = models.Workspace || model("Workspace", workspaceSchema);

export default Workspace;