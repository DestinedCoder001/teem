import { Request, Response } from "express";
import { connectDb } from "../lib/connectDb";
import { Task } from "../models/task.model";
import Workspace from "../models/workspace.model";
import { Types } from "mongoose";
import { matchedData, validationResult } from "express-validator";
import { sanitizeHtml } from "../utils/sanitizeHtml";

const createTask = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({
      results: result.array(),
    });
  }

  const { workspaceId } = req.params;
  const { assignedTo } = req.body;
  const { title, guidelines, dueDate } = matchedData(req);

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!assignedTo) {
    return res.status(400).json({ message: "Assignee is required" });
  }

  if (!Types.ObjectId.isValid(assignedTo)) {
    return res.status(400).json({ message: "Invalid user id (body)" });
  }

  if (dueDate instanceof Date && dueDate < new Date()) {
    return res.status(400).json({ message: "Date must be in the future" });
  }

  try {
    await connectDb();
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      users: { $in: [req.user._id] },
    });
    const isUserInWorkspace = workspace.users.includes(req.user._id);
    const isAssigneeInWorkspace = workspace.users.includes(assignedTo);

    if (!isUserInWorkspace) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    if (!isAssigneeInWorkspace) {
      return res.status(404).json({ message: "Assignee not in workspace" });
    }

    const cleanedGuidlines = sanitizeHtml(guidelines);

    const newTask = await Task.create({
      title,
      guidelines: cleanedGuidlines,
      assignedBy: req.user._id,
      assignedTo,
      workspace: workspace._id,
      dueDate,
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

const getTasks = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { workspaceId } = req.params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  try {
    await connectDb();
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      users: { $in: [req.user._id] },
    });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const tasks = await Task.find({
      $or: [{ assignedBy: req.user._id }, { assignedTo: req.user._id }],
      workspace: workspaceId,
    }).populate({
      path: "assignedTo assignedBy",
      select: "firstName lastName email profilePicture",
    });
    const modTasks = tasks.map((task) => {
      const taskObj = task.toObject();
      taskObj.isDue =
        task.status === "pending" && new Date(task.dueDate) < new Date();
      return taskObj;
    });

    res.status(200).json({ data: modTasks });
  } catch (error: any) {
    console.log("Error in getting tasks: ", error);
    res.status(500).json(error.message);
  }
};

const editTask = async (req: Request, res: Response) => {
  const { taskId, title, guidelines, dueDate, assignedTo } = req.body;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !guidelines || !taskId || !dueDate) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }
  if (!Types.ObjectId.isValid(assignedTo)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (typeof dueDate !== "string" || isNaN(Date.parse(dueDate))) {
    return res.status(400).json({ message: "Invalid due date" });
  }

  const dueDateObj = new Date(dueDate);

  if (dueDateObj < new Date()) {
    return res.status(400).json({ message: "Date must be in the future" });
  }

  try {
    await connectDb();

    const cleanedGuidelines = sanitizeHtml(guidelines);

    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedBy: req.user._id },
      { title, guidelines: cleanedGuidelines, dueDate, assignedTo }
    );

    if (!task) {
      return res.status(404).json({ message: "Could not edit task" });
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

  if (status !== "pending" && status !== "completed") {
    return res.status(400).json({ message: "Invalid status" });
  }

  if (!Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  try {
    await connectDb();

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (
      task.assignedTo.toString() !== req.user._id &&
      task.assignedBy.toString() !== req.user._id
    ) {
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
      assignedBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Unable to delete task" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error: any) {
    console.log("Error in deleting task: ", error);
    res.status(500).json(error.message);
  }
};

export { createTask, getTasks, editTask, updateTaskStatus, deleteTask };
