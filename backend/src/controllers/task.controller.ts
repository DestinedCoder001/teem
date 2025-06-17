import { Request, Response } from "express";
import { connectDb } from "../lib/connectDb";
import { Task } from "../models/task.model";
import Workspace from "../models/workspace.model";
import { Types } from "mongoose";
import { User } from "../utils/types";

const createTask = async (req: Request, res: Response) => {
  const { title, summary } = req.body;
  const { workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!title || !summary) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await connectDb();
    const workspace = await Workspace.findOne({ _id: workspaceId });
    const isUserInWorkspace = workspace.users.includes(req.user.id);

    if (!isUserInWorkspace) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    const newTask = await Task.create({
      title,
      summary,
      assignedBy: req.user.id,
      workspace: workspace._id,
    });

    res.status(201).json({
      message: "Task created successfully",
      data: { task: newTask },
    });
  } catch (error: any) {
    console.log("Error in creating task: ", error);
    res.status(500).json(error.message);
  }
};

const editTask = async (req: Request, res: Response) => {
  const { taskId, title, summary } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !summary || !taskId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  try {
    await connectDb();

    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedBy: req.user.id },
      { title, summary }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully" });
  } catch (error: any) {
    console.log("Error in updating task: ", error);
    res.status(500).json(error.message);
  }
};

const updateTaskStatus = async (req: Request, res: Response) => {
  const { taskId, status } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!status || !taskId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  try {
    await connectDb();

    const task = await Task.findOne({_id: taskId,});

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo.toString() !== req.user.id || task.assignedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    task.status = status;
    await task.save();

    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error: any) {
    console.log("Error in updating task status: ", error);
    res.status(500).json(error.message);
  }
};

const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!taskId) {
    return res.status(400).json({ message: "Task id is required" });
  }

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  try {
    await connectDb();

    const task = await Task.findOneAndDelete({
      _id: taskId,
      assignedBy: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.log("Error in deleting task: ", error);
    res.status(500).json(error.message);
  }
};

export { createTask, editTask, updateTaskStatus, deleteTask };
