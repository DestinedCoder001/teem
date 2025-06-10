import { model, models, Schema } from "mongoose";

const workspaceInviteSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
  },
  { timestamps: true }
);

const WorkspaceInvite = models.WorkspaceInvite|| model("WorkspaceInvite", workspaceInviteSchema);

export default WorkspaceInvite;
