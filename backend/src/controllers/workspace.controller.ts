import { Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { connectDb } from "../lib/connectDb";
import Workspace from "../models/workspace.model";
import User from "../models/user.model";
import { User as UserType } from "../utils/types";
import { Types } from "mongoose";
import WorkspaceInvite from "../models/workspaceInvite.model";
import Channel from "../models/channel.model";

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
      createdBy: req.user._id,
      users: [req.user._id],
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


const getUserWorkspaces = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const workspaces = await Workspace.find({ users: req.user._id }).select("name");
    res.status(200).json({ data: workspaces });
  } catch (error: any) {
    console.log("Error in getting user workspaces: ", error);
    res.status(500).json(error.message);
  }
}

const getWsDetails = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const workspace = await Workspace.findById(workspaceId).populate({
      path: "users",
      select: "firstName lastName email createdAt profilePicture",
    }).populate("channels");

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    res.status(200).json({ data: workspace });
  } catch (error: any) {
    console.log("Error in getting workspace details: ", error);
    res.status(500).json(error.message);
  }
};

const sendInvite = async (req: Request, res: Response) => {
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

    const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const invite = await WorkspaceInvite.findOne({
      receiver: receiver._id,
      workspace: workspaceId,
    });

    if (invite) {
      return res.status(400).json({ message: "Invite already sent" });
    }

    if (receiver._id.toString() === req.user._id) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    if (workspace.users.includes(receiver._id)) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    if (receiver.isVerified === false) {
      return res.status(400).json({ message: "User not verified" });
    }

    await WorkspaceInvite.create({
      sender: req.user._id,
      receiver: receiver._id,
      workspace: workspace._id,
    });
    res.status(200).json({ message: "Invite sent successfully" });
  } catch (error: any) {
    res.status(500).json("Error in sending invite: " + error.message);
  }
};

const acceptInvite = async (req: Request, res: Response) => {

  const { workspaceId } = req.params;
  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const invite = await WorkspaceInvite.findOne({ workspace: workspaceId });
    if (!invite) {
      return res.status(404).json({ message: "Invite not found" });
    }

    if (invite.receiver.toString() === req.user._id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    const workspace = await Workspace.findOne({ _id: invite.workspace });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() === req.user._id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    if (workspace.users.includes(invite.receiver)) {
      return res.status(400).json({ message: "You are already in workspace" });
    }

    await Workspace.findOneAndUpdate(
      { _id: invite.workspace },
      { $push: { users: invite.receiver } }
    );

    await WorkspaceInvite.deleteOne({ _id: invite._id });
    res.status(200).json({ message: "Invite accepted successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Error in accepting workspace invite: " + error.message,
    });
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
    if (workspace.createdBy.toString() !== req.user._id) {
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
    );
    res.status(200).json({ message: "User removed successfully" });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error in removing user from workspace: " + error);
  }
};

const deleteWs = async (req: Request, res: Response) => {

  const { workspaceId } = req.params;
  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();

    const workspace = await Workspace.findOne({ _id: workspaceId });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    if (workspace.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    await WorkspaceInvite.deleteMany({ workspace: workspaceId });
    const deletedWorkspace = await Workspace.findOneAndDelete(
      { _id: workspaceId },
    );
    res.status(200).json({ message: "Workspace deleted successfully", data: deletedWorkspace });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error in deleting from workspace: " + error);
  }
};

export { createWs, getWsDetails, getUserWorkspaces, sendInvite, removeUser, acceptInvite, deleteWs };
