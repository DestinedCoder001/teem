import { Schema, model, models } from "mongoose";

const tasksSchema = new Schema({
  title: { type: String, required: true },
  guidelines: { type: String, required: true },
  assignedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: "User", required: true },
  workspace: { type: Schema.Types.ObjectId, ref: "Workspace", required: true },
  status: { type: String, default: "pending", enum: ["pending", "completed"] },
  dueDate: { type: Date, required: true },
});

export const Task = models.Task || model("Task", tasksSchema);
