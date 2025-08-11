import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import Channel from "../models/channel.model";
import Message from "../models/message.model";
import { Request, Response } from "express";
import User from "../models/user.model";
import Workspace from "../models/workspace.model";

// FOR CHANNELS
const sendMessage = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  const { message, attachment } = req.body;

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

    if (!channel.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      channel: channelId,
      content: message,
      workspace: workspaceId,
      attachment,
    });

    await newMessage.populate({
      path: "sender",
      select: "firstName lastName profilePicture",
    });

    res.status(200).json({
      message: newMessage,
    });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const editMessage = async (req: Request, res: Response) => {
  const { messageId, message } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!message || !messageId) {
    return res
      .status(400)
      .json({ message: "Message id and content are required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, sender: req.user._id },
      { content: message, edited: true },
      { new: true }
    );

    await updatedMessage.populate({
      path: "sender",
      select: "firstName lastName profilePicture",
    });

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: updatedMessage });
  } catch (error: any) {
    res.status(500).json("Error updating message: " + error.message);
  }
};

const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!messageId) {
    return res.status(400).json({ message: "Message id is required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const deletedMessage = await Message.findOneAndUpdate(
      {
        _id: messageId,
        sender: req.user._id,
      },
      {
        deleted: true,
        content: "",
        attachment: {
          fileName: "",
          type: "",
          url: "",
        },
      }
    );

    if (!deletedMessage || deletedMessage.matchedCount === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error: any) {
    res.status(500).json("Error deleting message: " + error.message);
  }
};

// FOR DMs
const sendChatMessage = async (req: Request, res: Response) => {
  const { receiverId, workspaceId } = req.params;
  const { message, attachment } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid receiver id" });
  }

  try {
    await connectDb();
    const user = await User.findOne({
      _id: receiverId,
    });
    const workspace = await Workspace.findOne({
      _id: workspaceId,
    })

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (!workspace.users.includes(req.user._id)) {
      return res.status(403).json({ message: "Action not permitted." });
    }
    if (!workspace.users.includes(receiverId)) {
      return res.status(403).json({ message: "User not in workspace" });
    }

    // sort ids so that they're always same
    const sortedIds = [req.user._id, receiverId].sort();
    const chatId = `${workspaceId}-${sortedIds[0]}-${sortedIds[1]}`;

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      content: message,
      workspace: workspaceId,
      chatId,
      attachment,
    });

    await newMessage.populate({
      path: "sender",
      select: "firstName lastName profilePicture",
    });

    res.status(200).json({
      message: newMessage,
    });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const editChatMessage = async (req: Request, res: Response) => {
  const { messageId, message } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!message || !messageId) {
    return res
      .status(400)
      .json({ message: "Message id and content are required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, sender: req.user._id },
      { content: message, edited: true },
      { new: true }
    );

    await updatedMessage.populate({
      path: "sender",
      select: "firstName lastName profilePicture",
    });

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: updatedMessage });
  } catch (error: any) {
    res.status(500).json("Error updating message: " + error.message);
  }
};

const deleteChatMessage = async (req: Request, res: Response) => {
  const { messageId } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!messageId) {
    return res.status(400).json({ message: "Message id is required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const deletedMessage = await Message.findOneAndUpdate(
      {
        _id: messageId,
        sender: req.user._id,
      },
      {
        deleted: true,
        content: "",
        attachment: {
          fileName: "",
          type: "",
          url: "",
        },
      }
    );

    if (!deletedMessage || deletedMessage.matchedCount === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error: any) {
    res.status(500).json("Error deleting message: " + error.message);
  }
};

export {
  sendMessage,
  editMessage,
  deleteMessage,
  sendChatMessage,
  editChatMessage,
  deleteChatMessage,
};
