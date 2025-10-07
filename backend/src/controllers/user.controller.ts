import { Request, Response } from "express";
import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import User from "../models/user.model";
import { Otp } from "../models/otp.model";
import WorkspaceInvite from "../models/workspaceInvite.model";
import Workspace from "../models/workspace.model";
import Channel from "../models/channel.model";
import { Task } from "../models/task.model";
import bcrypt from "bcrypt";
import { matchedData, validationResult } from "express-validator";
import { verifyGoogleToken } from "../lib/googleAuthHelper";
import { Meeting } from "../models/meeting.model";

const me = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const workspaces = await Workspace.find({ users: req.user._id }).select(
    "name profilePicture"
  );
  return res.status(200).json({ user: req.user, workspaces });
};

const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    await connectDb();
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const findByEmail = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const results = validationResult(req);

  if (!results.isEmpty()) {
    return res.status(400).send({
      results: results.array()[0].msg,
    });
  }

  try {
    const { email } = matchedData(req);
    await connectDb();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const editUserDetails = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "First name and last name required" });
  }

  try {
    await connectDb();

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        firstName,
        lastName,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({
      message: "User details updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {}
};

const deleteAccount = async (req: Request, res: Response) => {
  const password = req.body?.password;
  const code = req.body?.code;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;

  // prevent deleting guest account i set up :(
  if (userId === "68df95764ae8a3a49cd112eb") {
    return res.status(403).json({ message: "You cannot delete this account" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    await connectDb();
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.authProvider === "local") {
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
    }

    if (user.authProvider === "google") {
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }
      const payload = await verifyGoogleToken(code);

      if (!payload?.email) {
        return res.status(400).json({ message: "Invalid Google token" });
      }

      if (payload.email !== user.email) {
        return res.status(403).json({ message: "Invalid credentials" });
      }
    }

    await User.findOneAndDelete({ _id: userId });
    await Otp.deleteMany({ email: req.user.email });
    await WorkspaceInvite.deleteMany({ receiver: userId });
    await Meeting.deleteMany({ host: userId });
    await Meeting.updateMany(
      { users: userId },
      { $pull: { allowedUsers: userId } }
    );
    await Workspace.deleteMany({ createdBy: userId });
    await Channel.deleteMany({ createdBy: userId });
    await Workspace.updateMany({ users: userId }, { $pull: { users: userId } });
    await Channel.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    res.clearCookie("tjwt");

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// TASKS

const getUserTasks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  try {
    await connectDb();
    const tasks = await Task.find({ assignedTo: userId });

    if (!tasks) {
      return res.status(404).json({ message: "Task(s) not found" });
    }

    return res.status(200).json({ message: "Request successful", data: tasks });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

// INVITES
const getWorkspaceInvites = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const invites = await WorkspaceInvite.find({
      $or: [{ receiver: req.user._id }, { sender: req.user._id }],
    })
      .populate({
        path: "workspace",
        select: "name",
      })
      .populate({
        path: "sender",
        select: "firstName lastName",
      })
      .populate({
        path: "receiver",
        select: "firstName lastName",
      });

    if (!invites) {
      return res.status(404).json({ message: "Invite(s) not found" });
    }

    return res.status(200).json({ invites });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  me,
  getUser,
  editUserDetails,
  deleteAccount,
  getUserTasks,
  findByEmail,
  getWorkspaceInvites,
};
