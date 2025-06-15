import { Request, Response } from "express";
import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import User from "../models/user.model";
import { Otp } from "../models/otp.model";
import WorkspaceInvite from "../models/workspaceInvite.model";
import Workspace from "../models/workspace.model";
import Channel from "../models/channel.model";

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
    return res.status(200).json({ message: "Request successful", data: user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const editUserDetails = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const { userId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  if (userId !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!firstName || !lastName) {
    return res.status(400).json({ message: "First name and last name required" });
  }

  try {
    await connectDb();

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
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
  const { userId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  if (userId !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();

    const deletedUser = await User.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await Otp.deleteMany({ email: req.user.email });
    await WorkspaceInvite.deleteMany({ receiver: userId });
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

export { getUser, editUserDetails, deleteAccount };
