import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { connectDb } from "../lib/connectDb";
import Workspace from "../models/workspace.model";
import User from "../models/user.model";
import { User as UserType } from "../lib/types";
import { Types } from "mongoose";

const createWs = async (req: Request, res: Response) => {
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    return res.status(400).json({
      results: validationResults.array(),
    });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { name } = matchedData(req);
    await connectDb();
    const newWorkSpace = await Workspace.create({
      name,
      createdBy: req.user.id,
      users: [req.user.id],
    });
    res.status(201).json({
      message: "Workspace created successfully",
      data: { workspace: newWorkSpace },
    });
  } catch (error: any) {
    console.log("Error in creating workspace: ", error);
    res.status(500).json(error.message);
  }
};

const addUser = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }
  const validationResults = validationResult(req);

  if (!validationResults.isEmpty()) {
    return res.status(400).json({
      results: validationResults.array(),
    });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const { email } = matchedData(req);

    const userToBeAdded = await User.findOne({ email });

    if (!userToBeAdded) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToBeAdded._id.toString() === req.user.id) {
      return res.status(400).json({ message: "You cannot add yourself" });
    }

    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    if (workspace.users.includes(userToBeAdded._id)) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    if (userToBeAdded.isVerified === false) {
      return res.status(400).json({ message: "User not verified" });
    }

    workspace.users.push(userToBeAdded._id);
    await workspace.save();
    res.status(200).json({ message: "User added successfully" });
  } catch (error: any) {
    res.status(500).json("Error in adding user to workspace: " + error.message);
  }
};

const removeUser = async (req: Request, res: Response) => {
  const validationResults = validationResult(req);

  const { workspaceId } = req.params;
  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!validationResults.isEmpty()) {
    return res.status(400).json({
      results: validationResults.array(),
    });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const { email } = matchedData(req);

    const workspace = await Workspace.findOne({ _id: workspaceId }).populate(
      "users"
    );
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    if (workspace.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Action not permitted." });
    }
    if (email === req.user.email) {
      return res.status(400).json({ message: "You cannot remove yourself" });
    }

    const userToBeRemoved = workspace.users.find(
      (user: UserType) => user.email === email
    );
    if (!userToBeRemoved) {
      return res.status(400).json({ message: "User not in workspace" });
    }

    await Workspace.findOneAndUpdate(
      { _id: workspaceId },
      { $pull: { users: userToBeRemoved._id } },
      { new: true }
    );
    // i didn't check if user exists so they can be removed even if they deleted their account
    res.status(200).json({ message: "User with email removed successfully" });
  } catch (error: any) {
    console.log(error)
    res.status(500).json("Error in removing user from workspace: " + error);
  }
};

export { createWs, addUser, removeUser };
