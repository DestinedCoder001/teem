import { Request, Response } from "express";
import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import Channel from "../models/channel.model";
import Workspace from "../models/workspace.model";
import { User } from "../utils/types";
import Message from "../models/message.model";

const createChannel = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Channel name and description is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
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

    const isUserInWorkspace = workspace.users.find((user: User) => {
      return user._id.toString() === req.user?._id;
    });

    if (!isUserInWorkspace) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    const newChannel = await Channel.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user._id,
      members: [req.user._id],
    });
    await workspace.channels.push(newChannel._id);
    await workspace.save();
    res.status(201).json({
      message: "Channel created successfully",
      data: { channel: newChannel },
    });
  } catch (error: any) {
    console.log("Error in creating channel: ", error);
    res.status(500).json(error.message);
  }
};

const editChannelDetails = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  const { name, description } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Channel name and description is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();
    const updatedChannel = await Channel.findOneAndUpdate(
      {
        _id: channelId,
        workspace: workspaceId,
        members: { $in: [req.user._id] },
      },
      {
        name,
        description,
      },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({
      message: "Channel details updated successfully",
      data: { channel: updatedChannel },
    });
  } catch (error: any) {
    console.log("Error in updating channel details: ", error);
    res.status(500).json(error.message);
  }
};

const addMembers = async (req: Request, res: Response) => {
  const { newMembers } = req.body;
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!newMembers) {
    return res.status(400).json({ message: "newMembers is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  newMembers.map((id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id", data: id });
    }
  });

  const userIds = newMembers.map((id: string) => {
    return new Types.ObjectId(id);
  });

  try {
    await connectDb();
    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channelId },
      { $addToSet: { members: { $each: userIds } } },
      { new: true }
    ).populate({
      path: "members",
      select: "firstName lastName",
    });

    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({
      message: "Channel member(s) added successfully",
      data: updatedChannel,
    });
  } catch (error: any) {
    console.log("Error in adding channel member(s): ", error);
    res.status(500).json(error.message);
  }
};

const removeMembers = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  const { toBeRemoved } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!toBeRemoved) {
    return res.status(400).json({ message: "Payload is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  toBeRemoved.map((id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id", data: id });
    }
  });

  const userIds = toBeRemoved.map((id: string) => {
    return new Types.ObjectId(id);
  });

  try {
    await connectDb();
    const channel = await Channel.findOne({
      _id: channelId,
      workspace: workspaceId,
    });
    if (channel.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Action not permitted" });
    }

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channelId, workspace: workspaceId },
      { $pull: { members: { $in: userIds } } },
      { new: true }
    );

    res.status(200).json({
      message: "Member(s) removed successfully",
      data: updatedChannel,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error in removing member(s) from channel: " + error);
  }
};

const getChannelDetails = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

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
      return res.status(403).json({ message: "Channel not available" });
    }
    const channel = await Channel.findOne({
      _id: channelId,
      workspace: workspaceId,
    }).populate({
      path: "members",
      select: "firstName lastName",
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.status(200).json({ data: channel });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const getChannelMessages = async (req: Request, res: Response) => {
  const { channelId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();
    const messages = await Message.find({
      channel: channelId,
    });
    res.status(200).json({ data: messages });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const joinChannel = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();

    const isUserInWorkspace = await Workspace.findOne({
      _id: workspaceId,
      users: req.user._id,
    });

    if (!isUserInWorkspace) {
      return res.status(403).json({ message: "Action not permitted" });
    }

    const channel = await Channel.findOne({
      _id: channelId,
      workspace: workspaceId,
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User already in channel" });
    }

    const updatedChannel = await Channel.findOneAndUpdate(
      {
        _id: channelId,
        workspace: workspaceId,
      },
      { $addToSet: { members: req.user._id } },
      { new: true }
    );

    res.status(200).json({
      message: "Joined channel successfully",
      data: updatedChannel,
    });
  } catch (error: any) {
    console.log("Error in joining channel: ", error);
    res.status(500).json({
      message: "Error in joining channel",
      error: error.message,
    });
  }
};

const leaveChannel = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();

    const updatedChannel = await Channel.findOneAndUpdate(
      {
        _id: channelId,
        workspace: workspaceId,
        members: { $in: [req.user._id] },
      },
      { $pull: { members: req.user._id } },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({
      message: "You have left the channel successfully",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error in leaving channel: " + error.message + " ");
  }
};

const deleteChannel = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();
    const channel = await Channel.findOne({
      _id: channelId,
      workspace: workspaceId,
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.createdBy.toString() !== req.user._id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    await Channel.findOneAndDelete({ _id: channelId, workspace: workspaceId });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

export {
  createChannel,
  editChannelDetails,
  addMembers,
  joinChannel,
  leaveChannel,
  getChannelMessages,
  getChannelDetails,
  removeMembers,
  deleteChannel,
};
